# ==============================================================================
# R CORPORATION KNOWLEDGE BASE: PYTHON 3 PROGRAMMING FUNDAMENTALS
# Document ID: KB-PY-BASE-2026-v1.0
# Classification: Technical Reference & Training Manual
# Target Audience: Developers, Support Engineers, Technical Operations
# ==============================================================================

## 1. Introduction to Python
Python is a high-level, interpreted, dynamically-typed, garbage-collected programming language known for its emphasis on code readability and clean syntax. R Corporation adopts Python 3 (specifically 3.10+) as the foundational language across backend microservices, data engineering pipelines, AI/ML inference layers, and automation sidecars.

### 1.1 Python Execution Model
Python source code (.py files) is compiled into bytecode (.pyc) by the CPython interpreter, which is then executed by the Python Virtual Machine (PVM).

---

## 2. Variables, Dynamic Typing, and Core Data Types

### 2.1 Dynamic Typing & Memory Allocation
In Python, variables are named references (pointers) to objects in memory, not fixed memory slots. The same variable can point to different types over its lifetime:
```python
x = 42          # x references an integer object
x = "R Corp"    # x now references a string object
```

### 2.2 Built-in Primitive Types
1. **Integers (`int`)**: Arbitrary-precision signed integers (e.g., `42`, `-100`, `1_000_000`).
2. **Floating-Point Numbers (`float`)**: Double-precision 64-bit IEEE 754 floats (e.g., `3.14159`, `1e-4`).
3. **Booleans (`bool`)**: Subclass of integer (`True` == 1, `False` == 0).
4. **Strings (`str`)**: Immutable sequences of Unicode characters (e.g., `"Hello"`, `'R Corporation'`).
5. **NoneType (`None`)**: The singleton object representing the absence of a value.

### 2.3 Type Checking and Conversion
```python
value = "1024"
num = int(value)          # 1024
pi_approx = float("3.14") # 3.14
flag = bool(num)          # True (any non-zero integer evaluates to True)

type_name = type(num)     # <class 'int'>
is_integer = isinstance(num, (int, float)) # True
```

---

## 3. Core Data Structures: Mutability and Use Cases

| Data Structure | Syntax Example | Mutable? | Ordered? | Duplicates Allowed? | Common Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`list`** | `[1, 2, "three"]` | Yes | Yes | Yes | Ordered sequences, dynamic queues, stacks |
| **`tuple`** | `(1, 2, "three")` | No | Yes | Yes | Fixed records, database rows, dictionary keys |
| **`dict`** | `{"id": 101, "name": "Alice"}` | Yes | Yes (3.7+) | Keys: No, Values: Yes | Key-value mapping, JSON serialization, lookups |
| **`set`** | `{1, 2, 3}` | Yes | No | No | Membership testing, deduplication, Venn math |

### 3.1 List Operations
```python
items = ["router", "switch", "firewall"]
items.append("gateway")       # Appends to end
items.insert(1, "server")     # Inserts at index 1
items.pop()                   # Removes and returns last element ("gateway")
slice_sample = items[1:3]     # Slicing: ['server', 'switch']
```

### 3.2 Dictionary Operations
```python
config = {"host": "127.0.0.1", "port": 8000, "ssl": True}
port = config.get("port", 443)  # Safe lookup with default fallback
config["timeout"] = 30          # Insertion / Mutation

# Iteration
for key, val in config.items():
    print(f"{key}: {val}")
```

### 3.3 Set Operations
```python
allowed_roles = {"admin", "support_agent", "super_admin"}
user_roles = {"customer", "admin"}

common = allowed_roles & user_roles      # Intersection: {'admin'}
all_roles = allowed_roles | user_roles   # Union
is_authorized = bool(allowed_roles & user_roles)
```

---

## 4. Control Flow and Iteration

### 4.1 Conditionals (`if` / `elif` / `else`)
Python uses indentation (4 spaces PEP 8 standard) rather than braces:
```python
sentiment_score = -0.75

if sentiment_score > 0.3:
    emotion_tier = "Positive"
elif sentiment_score < -0.3:
    emotion_tier = "Negative"
else:
    emotion_tier = "Neutral"
```

### 4.2 Loops (`for` and `while`)
```python
# For loop with enumerate (index + value)
servers = ["node-01", "node-02", "node-03"]
for index, server in enumerate(servers, start=1):
    print(f"Server #{index}: {server}")

# While loop with break and continue
retry_count = 0
max_retries = 3
while retry_count < max_retries:
    retry_count += 1
    if retry_count == 2:
        continue  # skip this iteration
    print(f"Connecting attempt: {retry_count}")
```

### 4.3 List & Dictionary Comprehensions
Pythonic, high-performance syntax for transforming iterables:
```python
# List comprehension
tickets = [101, 102, 103, 104]
urgent_tickets = [f"RCORP-{t}" for t in tickets if t % 2 == 1]
# Result: ['RCORP-101', 'RCORP-103']

# Dictionary comprehension
users = [("alice", "admin"), ("bob", "agent"), ("carol", "customer")]
role_map = {name: role.upper() for name, role in users}
# Result: {'alice': 'ADMIN', 'bob': 'AGENT', 'carol': 'CUSTOMER'}
```

---

## 5. Functions, Scope, and Arguments

### 5.1 Function Definition, Defaults, and Type Hints
```python
def calculate_sla_deadline(hours_allowed: int, is_urgent: bool = False) -> int:
    """
    Calculate maximum resolution window in hours.
    If ticket is marked urgent, deadline is halved.
    """
    if is_urgent:
        return max(1, hours_allowed // 2)
    return hours_allowed
```

### 5.2 Arbitrary Arguments (`*args` and `**kwargs`)
- `*args`: Collects positional arguments into a `tuple`.
- `**kwargs`: Collects keyword arguments into a `dict`.

```python
def log_support_event(event_name: str, *tags, **metadata):
    print(f"Event: {event_name}")
    print(f"Tags: {tags}")
    print(f"Metadata: {metadata}")

log_support_event(
    "TicketEscalation",
    "fiber", "high-priority",
    ticket_id="RCORP-892104",
    agent="Alex Rivera"
)
```

---

## 6. Object-Oriented Programming (OOP) in Python

### 6.1 Classes, Constructors, and Methods
```python
class CustomerTicket:
    # Class-level variable shared by all instances
    prefix: str = "RCORP"

    def __init__(self, ticket_id: int, title: str, priority: str = "Medium"):
        # Instance variables
        self.ticket_number = f"{self.prefix}-{ticket_id}"
        self.title = title
        self.priority = priority
        self.status = "Open"

    def mark_resolved(self, resolution_notes: str) -> None:
        self.status = "Resolved"
        self.resolution_notes = resolution_notes

    def __repr__(self) -> str:
        return f"<CustomerTicket {self.ticket_number} [{self.status}]>"
```

### 6.2 Inheritance and Polymorphism
```python
class EscalatedTicket(CustomerTicket):
    def __init__(self, ticket_id: int, title: str, supervisor_id: str):
        super().__init__(ticket_id, title, priority="Urgent")
        self.supervisor_id = supervisor_id

    def mark_resolved(self, resolution_notes: str) -> None:
        super().mark_resolved(f"[Supervisor Verified: {self.supervisor_id}] {resolution_notes}")
```

---

## 7. Exception Handling and Defensive Programming
Python uses `try` / `except` / `else` / `finally` blocks for structured error management:

```python
def fetch_account_balance(account_id: str) -> float:
    try:
        raw_data = {"acc_101": "250.75"}
        if account_id not in raw_data:
            raise KeyError(f"Account {account_id} not registered.")
        return float(raw_data[account_id])
    except KeyError as ke:
        print(f"Account lookup error: {ke}")
        return 0.0
    except ValueError as ve:
        print(f"Corrupt balance format: {ve}")
        return 0.0
    else:
        print("Balance parsed successfully.")
    finally:
        print("Closing database session connection.")
```

---

## 8. Working with Files and Context Managers
Always use the `with` statement (context manager) to guarantee automatic resource cleanup (closing file handles, releasing locks):

```python
# Writing to a file
with open("system_audit.log", mode="w", encoding="utf-8") as f:
    f.write("2026-10-17 11:30:00 - Service healthy\n")

# Reading from a file line-by-line
with open("system_audit.log", mode="r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())
```

---

## 9. Standard Library Essentials
1. **`json`**: Parse and serialize JSON APIs (`json.dumps()`, `json.loads()`).
2. **`os` & `pathlib`**: Cross-platform filesystem paths (`Path(__file__).resolve()`).
3. **`datetime`**: Timestamps and intervals (`datetime.now()`, `timedelta(days=7)`).
4. **`re`**: Regular expressions for pattern matching and text sanitization.
5. **`collections`**: Advanced collections (`Counter`, `defaultdict`, `namedtuple`).

---

## 10. Python Best Practices & PEP 8 Standards
- **Indentation**: 4 spaces per indentation level. Never mix tabs and spaces.
- **Naming Conventions**:
  - `snake_case` for functions, methods, and variables.
  - `PascalCase` for classes.
  - `UPPER_SNAKE_CASE` for module-level constants.
- **Docstrings**: Use triple double-quotes (`"""Docstring"""`) for all public modules, functions, and classes.
- **Virtual Environments**: Always isolate project dependencies using `venv` or `virtualenv`:
  ```bash
  python -m venv venv
  source venv/bin/activate  # Linux/macOS
  .\venv\Scripts\activate   # Windows PowerShell
  ```
