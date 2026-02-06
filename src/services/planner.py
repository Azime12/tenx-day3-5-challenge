import json
import time
import uuid
import redis
from typing import List
from src.common.models import Task, TaskPriority, TaskStatus

class Planner:
    def __init__(self, redis_host='localhost', redis_port=6379, task_queue='task_queue'):
        self.redis_client = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)
        self.task_queue = task_queue

    def load_goals(self, filepath: str) -> List[str]:
        # Mock loading goals
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
            return data.get('goals', [])
        except FileNotFoundError:
            return ["Default Goal: Ensure system operational"]

    def decompose_goal(self, goal: str) -> List[Task]:
        # Mock decomposition logic
        print(f"[Planner] Decomposing goal: {goal}")
        tasks = []
        # Create 2 mock tasks per goal
        for i in range(2):
            task = Task(
                task_type="generate_content",
                priority=TaskPriority.HIGH,
                context={"instruction": f"Execute part {i+1} of {goal}"}
            )
            tasks.append(task)
        return tasks

    def run(self, goals_file='goals.json'):
        print("[Planner] Starting...")
        goals = self.load_goals(goals_file)
        
        for goal in goals:
            tasks = self.decompose_goal(goal)
            for task in tasks:
                print(f"[Planner] Pushing task {task.task_id} to {self.task_queue}")
                self.redis_client.lpush(self.task_queue, task.model_dump_json())
        
        print("[Planner] Planning complete.")

if __name__ == "__main__":
    planner = Planner()
    # Create a dummy goals.json if not exists
    import os
    if not os.path.exists('goals.json'):
        with open('goals.json', 'w') as f:
            json.dump({"goals": ["Launch viral campaign", "Monitor operational health"]}, f)
    
    planner.run()
