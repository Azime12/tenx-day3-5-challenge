import threading
import time
import redis
import json
import os
import sys

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.services.planner import Planner
from src.services.worker import Worker
from src.services.judge import Judge
from src.common.models import Task, Result

def run_planner():
    planner = Planner()
    # Manual injection for test
    task = Task(task_type="test_task", context={"instruction": "Say Hello"})
    print("[Test] Injecting task...")
    planner.redis_client.lpush(planner.task_queue, task.model_dump_json())

def run_worker():
    worker = Worker(worker_id="test_worker")
    # Run loop for limited time
    start = time.time()
    print("[Test] Worker started")
    while time.time() - start < 10:
        item = worker.redis_client.blpop(worker.task_queue, timeout=1)
        if item:
            _, task_json = item
            task = Task.model_validate_json(task_json)
            result = worker.process_task(task)
            worker.redis_client.lpush(worker.review_queue, result.model_dump_json())
            print("[Test] Worker finished task")

def run_judge():
    judge = Judge()
    start = time.time()
    print("[Test] Judge started")
    while time.time() - start < 10:
        item = judge.redis_client.blpop(judge.review_queue, timeout=1)
        if item:
            _, result_json = item
            result = Result.model_validate_json(result_json)
            judge.evaluate_result(result)
            print("[Test] Judge finished evaluation")

if __name__ == "__main__":
    print("Starting Swarm Verification...")
    
    # Ensure Redis is reachable
    try:
        r = redis.Redis(host='localhost', port=6379, decode_responses=True)
        r.ping()
        r.flushall() # Clean slate
    except redis.ConnectionError:
        print("CRITICAL: Redis is not running. Please start Redis.")
        sys.exit(1)

    # Start threads
    t_worker = threading.Thread(target=run_worker)
    t_judge = threading.Thread(target=run_judge)
    
    t_worker.start()
    t_judge.start()
    
    # Give them a second to warm up
    time.sleep(1)
    
    # Run Planner (Injector)
    run_planner()
    
    # Wait for threads
    t_worker.join()
    t_judge.join()
    
    print("Verification Complete.")
