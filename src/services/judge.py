import json
import time
import redis
from src.common.models import Result, ResultStatus

class Judge:
    def __init__(self, redis_host='localhost', redis_port=6379, review_queue='review_queue'):
        self.redis_client = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)
        self.review_queue = review_queue

    def evaluate_result(self, result: Result):
        print(f"[Judge] Evaluating result for task {result.task_id} from worker {result.worker_id}")
        if result.status == ResultStatus.SUCCESS and result.confidence_score > 0.9:
            print(f"[Judge] APPROVED: {result.output}")
        else:
            print(f"[Judge] REJECTED or LOW CONFIDENCE: {result.output}")

    def run(self):
        print(f"[Judge] Listening on {self.review_queue}...")
        while True:
            item = self.redis_client.blpop(self.review_queue, timeout=5)
            if item:
                _, result_json = item
                try:
                    result = Result.model_validate_json(result_json)
                    self.evaluate_result(result)
                except Exception as e:
                    print(f"[Judge] Error: {e}")
            else:
                pass

if __name__ == "__main__":
    judge = Judge()
    judge.run()
