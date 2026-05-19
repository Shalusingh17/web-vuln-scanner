import logging
import json
from pythonjsonlogger import jsonlogger


def setup_logger(name: str, log_file: str = None, level=logging.INFO):
    logger = logging.getLogger(name)
    # If a logger with handlers already exists, update level and return it
    if logger.handlers:
        logger.setLevel(level)
        return logger
    logger.setLevel(level)

    # JSON formatter for structured logs
    fmt = jsonlogger.JsonFormatter('%(asctime)s %(name)s %(levelname)s %(message)s')

    handler = logging.StreamHandler()
    handler.setFormatter(fmt)
    logger.addHandler(handler)

    if log_file:
        fh = logging.FileHandler(log_file)
        fh.setFormatter(fmt)
        logger.addHandler(fh)

    # Avoid duplicate propagation in interactive environments
    logger.propagate = False
    return logger
