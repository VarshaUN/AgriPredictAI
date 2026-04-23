"""Put AgriPredictAI on sys.path so top-level MLmodels imports work when cwd is backend."""
import sys
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parents[2]
_AGRIPREDICT = _REPO_ROOT / "AgriPredictAI"
if _AGRIPREDICT.is_dir():
    p = str(_AGRIPREDICT)
    if p not in sys.path:
        sys.path.insert(0, p)
