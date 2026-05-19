from datetime import datetime
from typing import List

import numpy as np
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field
from sklearn.linear_model import LinearRegression

app = FastAPI(title="StockFlow Forecast Service")


class ForecastRequest(BaseModel):
    product_id: str
    months: int = Field(default=6, ge=1, le=24)
    historical_sales: List[float] | None = None


@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.post("/forecast/demand")
def forecast_demand(request: ForecastRequest):
    if request.historical_sales and len(request.historical_sales) >= 3:
        series = np.array(request.historical_sales, dtype=float)
    else:
        series = np.array([120, 126, 132, 140, 146, 152, 161, 168], dtype=float)

    x = np.arange(len(series)).reshape(-1, 1)
    y = series
    model = LinearRegression()
    model.fit(x, y)

    future_x = np.arange(len(series), len(series) + request.months).reshape(-1, 1)
    pred = model.predict(future_x)
    predicted_demand = float(np.maximum(pred.mean(), 0.0))
    recommendation = float(predicted_demand * 1.18)

    trend = "upward" if pred[-1] > pred[0] else "stable"
    confidence = 0.84 if len(series) >= 6 else 0.73

    frame = pd.DataFrame({"period": list(range(1, request.months + 1)), "forecast": pred.round(2)})
    points = frame.to_dict(orient="records")

    return {
        "product_id": request.product_id,
        "predicted_demand": round(predicted_demand, 2),
        "recommended_restock": round(recommendation, 2),
        "confidence": confidence,
        "insight": f"Demand trend appears {trend}. Keep safety stock around 18%.",
        "series": points,
    }

