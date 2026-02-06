# Agent Logic Specifications
**Project**: Chimera Autonomous Influencer Network
**Status**: APPROVED
**Source**: Derived from `specs/chimera/functional/srs.md`

## 1. Planner Agent Logic

The Planner is responsible for decomposing high-level goals into Tasks.

```python
# Pseudocode - Planner Loop
def planner_lifecycle(campaign_id):
    while True:
        # 1. Fetch Context
        goal = fetch_campaign_goal(campaign_id)
        metrics = fetch_performance_metrics(campaign_id)
        
        # 2. Strategy Generation (LLM)
        strategy = llm.generate_strategy(goal, metrics)
        
        # 3. Task Decomposition
        tasks = []
        for item in strategy.items:
            task = Task(
                skill=map_skill(item),
                objective=item.objective,
                constraints=apply_global_policies(item)
            )
            tasks.append(task)
            
        # 4. Dispatch
        for task in tasks:
            orchestrator.enqueue(task)
            
        sleep(POLL_INTERVAL)
```

### 1.1 Planner Policies
- **No Direct Execution**: Planner MUST NEVER execute a task itself.
- **Budget Awareness**: Planner must divide the campaign budget across tasks.

## 2. Worker Agent Logic

The Worker is a stateless execution unit.

```python
# Pseudocode - Worker Execution
def worker_execute(task):
    try:
        # 1. Validation
        validate_skill_match(task.skill)
        
        # 2. Skill Execution (Isolated)
        if task.skill == 'skill_trend_research':
            artifacts = execute_trend_research(task.input_params)
        elif task.skill == 'skill_content_generate':
            artifacts = execute_content_gen(task.input_params)
        elif task.skill == 'skill_wallet_operation':
             # AgentKit Integation
            artifacts = execute_wallet_op(task.input_params)
            
        # 3. Evidence Collection
        evidence = collect_mcp_logs()
        
        # 4. Success Return
        return Result(status='success', artifacts=artifacts, evidence=evidence)
        
    except PolicyViolation as e:
        return Result(status='blocked', error=e)
    except Exception as e:
        return Result(status='error', error=e) # Retryable
```

### 2.1 Worker Policies
- **Read-Only Default**: Workers default to Read-Only on MCPs unless `skill` explicitly requires Write.
- **Secret Zero**: Workers never access raw secrets; they use MCP tools which handle auth.

## 3. Judge Agent Logic

The Judge evaluates quality and safety.

```python
# Pseudocode - Judge Evaluation
def judge_evaluate(task, result):
    # 1. Preliminary Check
    if result.status != 'success':
        return Evaluation(decision='reject', method='automatic')
        
    # 2. Policy Check (LLM + Rules)
    compliance_report = check_policies(result.artifacts)
    quality_score = assess_quality(result.artifacts, task.objective)
    
    # 3. Confidence Calculation
    confidence = calculate_confidence(compliance_report, quality_score)
    
    # 4. Routing Decision
    if risk_is_financial(task):
        decision = 'escalate_to_human' # Mandatory Override
    elif confidence > 0.90:
        decision = 'approve'
    elif confidence > 0.70:
        decision = 'escalate_to_human'
    else:
        decision = 'reject' # Retry
        
    return Evaluation(decision=decision, confidence=confidence)
```

### 3.1 Judge Policies
- **Bias Check**: Judges must run a specific "bias detection" routine on all text content.
- **Link Verification**: All generated URLs must be verified as active (HTTP 200).
