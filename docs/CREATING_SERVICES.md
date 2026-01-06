# Creating Services Guide

This guide explains how to create new services using the dependency injection architecture.

## Overview

Services follow this structure:
```
src/services/
├── interfaces/          # Service contracts (TypeScript interfaces)
├── mock/                # Mock implementations (in-memory data)
├── api/                 # API implementations (HTTP requests)
├── serviceProvider.ts   # Dependency injection
└── index.ts             # Public exports
```

## Step-by-Step Guide

### Step 1: Define the Model

Create a model in `src/models/` if it doesn't exist:

```typescript
// src/models/Customer.ts
export interface Customer {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}
```

Export it from `src/models/index.ts`:
```typescript
export type { Customer } from './Customer';
```

### Step 2: Create the Interface

Define the service contract in `src/services/interfaces/`:

```typescript
// src/services/interfaces/ICustomerService.ts
import type { Customer } from '@/models';

export interface ICustomerService {
  getAll(): Promise<Customer[]>;
  getById(id: number): Promise<Customer | null>;
  create(name: string, email: string): Promise<Customer>;
  update(id: number, updates: Partial<Pick<Customer, 'name' | 'email'>>): Promise<Customer | null>;
  delete(id: number): Promise<boolean>;
  resetMockData?(): void;  // Optional - only for mock implementation
}
```

Export it from `src/services/interfaces/index.ts`:
```typescript
export type { ICustomerService } from './ICustomerService';
```

### Step 3: Create Mock Data

Add mock data in `src/mocks/`:

```typescript
// src/mocks/mock_customers.ts
import type { Customer } from '@/models';

export const CUSTOMERS_DB: Customer[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: '2024-02-20T14:30:00Z'
  }
];
```

Export it from `src/mocks/index.ts`:
```typescript
export { CUSTOMERS_DB } from './mock_customers';
```

### Step 4: Create Mock Implementation

Create the mock service in `src/services/mock/`:

```typescript
// src/services/mock/mockCustomerService.ts
import type { Customer } from '@/models';
import type { ICustomerService } from '../interfaces';
import { CUSTOMERS_DB } from '@/mocks';
import { delay, cloneArray } from '@/utils/mockUtils';

let mockCustomers = cloneArray(CUSTOMERS_DB);

export const mockCustomerService: ICustomerService = {
  async getAll(): Promise<Customer[]> {
    await delay();
    return [...mockCustomers];
  },

  async getById(id: number): Promise<Customer | null> {
    await delay();
    return mockCustomers.find(c => c.id === id) || null;
  },

  async create(name: string, email: string): Promise<Customer> {
    await delay();
    const customer: Customer = {
      id: Date.now(),
      name,
      email,
      createdAt: new Date().toISOString()
    };
    mockCustomers.push(customer);
    return customer;
  },

  async update(id: number, updates: Partial<Pick<Customer, 'name' | 'email'>>): Promise<Customer | null> {
    await delay();
    const customer = mockCustomers.find(c => c.id === id);
    if (customer) {
      if (updates.name !== undefined) customer.name = updates.name;
      if (updates.email !== undefined) customer.email = updates.email;
      return { ...customer };
    }
    return null;
  },

  async delete(id: number): Promise<boolean> {
    await delay();
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCustomers.splice(index, 1);
      return true;
    }
    return false;
  },

  resetMockData(): void {
    mockCustomers = cloneArray(CUSTOMERS_DB);
  }
};
```

### Step 5: Create API Implementation

Create the API service in `src/services/api/`:

```typescript
// src/services/api/apiCustomerService.ts
import type { Customer } from '@/models';
import type { ICustomerService } from '../interfaces';
import { httpClient } from '../httpClient';

export const apiCustomerService: ICustomerService = {
  async getAll(): Promise<Customer[]> {
    return httpClient.get<Customer[]>('/customers');
  },

  async getById(id: number): Promise<Customer | null> {
    try {
      return await httpClient.get<Customer>(`/customers/${id}`);
    } catch {
      return null;
    }
  },

  async create(name: string, email: string): Promise<Customer> {
    return httpClient.post<Customer>('/customers', { name, email });
  },

  async update(id: number, updates: Partial<Pick<Customer, 'name' | 'email'>>): Promise<Customer | null> {
    return httpClient.patch<Customer>(`/customers/${id}`, updates);
  },

  async delete(id: number): Promise<boolean> {
    await httpClient.delete(`/customers/${id}`);
    return true;
  }
};
```

### Step 6: Register in Service Provider

Add to `src/services/serviceProvider.ts`:

```typescript
import type { ICustomerService } from './interfaces';
import { mockCustomerService } from './mock/mockCustomerService';
import { apiCustomerService } from './api/apiCustomerService';

export const customerService: ICustomerService = isMockMode()
  ? mockCustomerService
  : apiCustomerService;
```

### Step 7: Export from Index

Add to `src/services/index.ts`:

```typescript
export { customerService } from './serviceProvider';
export type { ICustomerService } from './interfaces';
```

## Usage

```typescript
import { customerService } from '@/services';

// Get all customers
const customers = await customerService.getAll();

// Get single customer
const customer = await customerService.getById(1);

// Create customer
const newCustomer = await customerService.create('Bob Wilson', 'bob@example.com');

// Update customer
const updated = await customerService.update(1, { email: 'newemail@example.com' });

// Delete customer
const deleted = await customerService.delete(1);

// Reset mock data (only works in mock mode)
customerService.resetMockData?.();
```

## API Endpoints

When using API mode, implement these endpoints on your backend:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | Get all customers |
| GET | `/customers/:id` | Get customer by ID |
| POST | `/customers` | Create customer |
| PATCH | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Delete customer |

## Best Practices

### 1. Interface First
Always define the interface before implementations. This ensures both mock and API implementations have the same contract.

### 2. Use Type Safety
```typescript
// Good - explicit return types
async getById(id: number): Promise<Customer | null>

// Avoid - implicit any
async getById(id)
```

### 3. Mock Delays
Always use `delay()` in mock implementations to simulate network latency:
```typescript
async getAll() {
  await delay();      // Default 300ms
  await delay(500);   // Custom delay
  return [...data];
}
```

### 4. Clone Data
Clone mock data to prevent mutations affecting the source:
```typescript
// Good
return [...mockCustomers];
return { ...customer };

// Bad - returns reference
return mockCustomers;
return customer;
```

### 5. Reset Method
Include `resetMockData()` for services with mutable state (useful for testing):
```typescript
resetMockData(): void {
  mockCustomers = cloneArray(CUSTOMERS_DB);
}
```

### 6. Error Handling
Handle errors gracefully in API implementations:
```typescript
async getById(id: number): Promise<Customer | null> {
  try {
    return await httpClient.get<Customer>(`/customers/${id}`);
  } catch {
    return null;
  }
}
```

## Checklist

When creating a new service, ensure you have:

- [ ] Model defined in `src/models/`
- [ ] Interface in `src/services/interfaces/`
- [ ] Interface exported from `src/services/interfaces/index.ts`
- [ ] Mock data in `src/mocks/`
- [ ] Mock data exported from `src/mocks/index.ts`
- [ ] Mock implementation in `src/services/mock/`
- [ ] API implementation in `src/services/api/`
- [ ] Service registered in `src/services/serviceProvider.ts`
- [ ] Service exported from `src/services/index.ts`
