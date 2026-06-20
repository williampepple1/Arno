import fs from 'fs';

const categories = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    description: 'React, Hooks, Context, State, Performance',
    topics: ['React Hooks', 'Context API', 'Component Libraries', 'RESTful Integration', 'Code Splitting', 'Lazy Loading']
  },
  {
    id: 'backend',
    name: 'Backend Development',
    description: 'PHP, Laravel, REST APIs, SOLID Principles',
    topics: ['Laravel Framework', 'RESTful APIs', 'Authentication/Authorization', 'SOLID Principles', 'Data Validation']
  },
  {
    id: 'cloud',
    name: 'Cloud Infrastructure (AWS) & DevOps',
    description: 'AWS ECS, Docker, Linux, CI/CD, GitLab',
    topics: ['AWS ECS', 'Dockerfiles & Compose', 'Linux Security', 'S3 & RDS', 'GitLab CI/CD', 'Monitoring']
  },
  {
    id: 'microservices',
    name: 'Microservices Architecture',
    description: 'Distributed systems, inter-service communication',
    topics: ['Service Boundaries', 'Message Queues', 'Fault Tolerance', 'Independent Deployment', 'Observability']
  },
  {
    id: 'genai',
    name: 'Generative AI Integration',
    description: 'OpenAI, RAG Pipelines, Prompt Engineering',
    topics: ['RAG Pipelines', 'Prompt Engineering', 'API Integration', 'AI Workflows', 'Emerging Tools']
  },
  {
    id: 'database',
    name: 'Database & SQL',
    description: 'MySQL, RDBMS, Performance Tuning',
    topics: ['Relational Schemas', 'Query Optimization', 'Migrations', 'Indexing Strategies', 'Transactions']
  }
];

const templates = [
  "Explain the core principles of {topic}.",
  "How would you troubleshoot performance issues related to {topic}?",
  "What are the best practices for implementing {topic} in a production environment?",
  "Can you describe a challenging scenario you faced involving {topic} and how you resolved it?",
  "How does {topic} integrate with the rest of the technology stack?",
  "What are the common pitfalls when working with {topic}?",
  "Compare and contrast {topic} with alternative approaches.",
  "How do you ensure security and scalability when utilizing {topic}?",
  "Walk me through the lifecycle of a request involving {topic}.",
  "How would you explain the value of {topic} to a non-technical stakeholder?"
];

const answerTemplates = [
  "The core concept revolves around optimizing the utilization of resources while maintaining strong decoupling. Specifically for {topic}, you should focus on robust error handling, monitoring, and adhering to established design patterns.",
  "When dealing with {topic}, it's essential to consider the trade-offs between latency and consistency. Implementing caching layers and asynchronous processing often helps.",
  "Security and maintainability are paramount. For {topic}, I ensure that all inputs are validated, configurations are externalized, and the system is covered by comprehensive unit and integration tests.",
  "In a production setting, {topic} requires careful resource allocation and observability. I would set up precise metrics using tools like Datadog or CloudWatch to identify bottlenecks proactively.",
  "A common pitfall with {topic} is over-engineering. It's better to start with a simplified, monolithic-like boundary within the service and extract only when the scaling needs dictate it."
];

let questionId = 1;
const allQuestions = [];

categories.forEach(category => {
  // Generate 100 questions per category
  for (let i = 0; i < 100; i++) {
    const topic = category.topics[i % category.topics.length];
    const template = templates[i % templates.length];
    const answerTemp = answerTemplates[i % answerTemplates.length];
    
    allQuestions.push({
      id: questionId++,
      categoryId: category.id,
      question: template.replace('{topic}', topic),
      answer: answerTemp.replace('{topic}', topic),
      isMastered: false
    });
  }
});

// Let's replace the first few of each category with very specific, high-quality questions.
const specificQuestions = {
  'frontend': [
    { q: "How does React's Context API differ from Redux, and when would you choose one over the other?", a: "Context API is ideal for low-frequency updates like themes or auth state. Redux is better suited for complex, high-frequency state changes where you need predictable state transitions, middleware, and time-travel debugging." },
    { q: "Explain how you would optimize a React application that is experiencing slow load times due to large bundle sizes.", a: "I would implement code splitting using React.lazy() and Suspense for route-based splitting. I would also analyze the bundle using Webpack Bundle Analyzer, optimize dependencies, use tree shaking, and lazy load heavy components or libraries." }
  ],
  'backend': [
    { q: "How do you implement the Dependency Inversion Principle (from SOLID) in a Laravel application?", a: "In Laravel, Dependency Inversion is typically implemented using the Service Container. You bind interfaces to concrete implementations in Service Providers, and then inject those interfaces into your controllers or other classes, decoupling them from concrete classes." },
    { q: "What is the best way to handle secure API authentication between a React frontend and a Laravel backend?", a: "Using Laravel Sanctum for SPA authentication. It uses Laravel's built-in cookie-based session authentication services, which provides CSRF protection and eliminates the need to store tokens in local storage, reducing XSS vulnerability." }
  ],
  'cloud': [
    { q: "What is the difference between AWS ECS Fargate and EC2 launch types?", a: "ECS EC2 launch type requires you to manage the underlying EC2 instances, providing more control over infrastructure. Fargate is serverless, where AWS manages the underlying infrastructure, allowing you to focus purely on container configuration and scaling." },
    { q: "Explain your branching strategy and CI/CD workflow in GitLab for a microservices architecture.", a: "I prefer a trunk-based development or GitHub Flow. Feature branches are merged to 'main' via Merge Requests after passing automated tests and code review. The CI/CD pipeline builds the Docker image, pushes it to ECR, and triggers an ECS rolling update." }
  ],
  'microservices': [
    { q: "How do you handle distributed transactions across multiple microservices?", a: "Distributed transactions are challenging. I typically avoid two-phase commits due to performance overhead and instead use the Saga pattern (choreography or orchestration) using message brokers like RabbitMQ or SQS to ensure eventual consistency, along with compensating transactions for failures." }
  ],
  'genai': [
    { q: "What is a RAG pipeline and how does it improve the output of an LLM?", a: "Retrieval-Augmented Generation (RAG) involves querying a vector database with the user's prompt to find relevant contextual data, then appending that data to the prompt before sending it to the LLM. It grounds the LLM's response in specific, factual data, reducing hallucinations." }
  ],
  'database': [
    { q: "What is an N+1 query problem, and how do you resolve it in Laravel (Eloquent)?", a: "The N+1 problem occurs when you fetch a list of models and then lazy-load a relationship for each model individually, resulting in N additional queries. In Laravel, you resolve this by using Eager Loading via the `with()` method, which fetches all necessary related models in just one or two queries." }
  ]
};

// Overwrite the first few questions in the generated array
categories.forEach(category => {
  const specific = specificQuestions[category.id] || [];
  const categoryQuestions = allQuestions.filter(q => q.categoryId === category.id);
  
  specific.forEach((sq, index) => {
    const qToReplace = categoryQuestions[index];
    qToReplace.question = sq.q;
    qToReplace.answer = sq.a;
  });
});

const output = {
  categories,
  questions: allQuestions
};

fs.mkdirSync('./src/data', { recursive: true });
fs.writeFileSync('./src/data/questions.json', JSON.stringify(output, null, 2));

console.log('Successfully generated questions.json with', allQuestions.length, 'questions.');
