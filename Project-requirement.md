## Phase 2 of SDLC
## functional requirement == All the functionality should available in the website 

## F1. FUNCTIONAL REQUIREMENTS (FR)
## FR1: User Authentication & Session Management
FR1.1: Secure Registration

Specification: The system must allow new users to create accounts using a unique email address, a name, and a password string.

Backend Constraint: Passwords must be dynamically intercepted and hashed using a salted hashing algorithm (bcryptjs with 10 rounds) before hitting long-term storage.

FR1.2: Cryptographic Login

Specification: The system must authenticate existing credentials. Upon matching validation hashes, the server will issue a signed JSON Web Token (JWT).

Delivery Mechanism: The JWT payload must be packaged inside an HTTP-Only, Secure cookie container to eliminate client-side XSS scripting access.

FR1.3: Stateless Logout

Specification: The system must provide an endpoint that clears the client's HTTP-Only authentication token context, instantly invalidating the browser session.

## FR2: Workspace Tenant Management
FR2.1: Workspace Isolation

Specification: Users must be able to provision isolated collaborative environments (Workspaces). The creator is automatically registered into the schema document matrix as OwnerId and assigned an 'Admin' authorization role flag.

FR2.2: Multi-Tenant Access Discovery

Specification: The dashboard query must dynamically map and display only those workspaces where the authenticated individual matches the ownerId or exists inside the embedded members array.

FR2.3: Role-Based Access Control (RBAC)

Specification: Workspace modifications (updating names, inviting users, destroying workspaces) must intercept requests and validate permissions based on hierarchical roles:

Owner / Admin: Complete read, write, update, and deletion capability.

Editor: Read and write authorization within inherited items (Documents), but cannot drop workspaces or alter user access tables.

Viewer: Strict read-only view state across documents and metadata.

## FR3: Document Lifecycle Management
FR3.1: Scoped Document Generation

Specification: Authorized workspace members (Admin or Editor) can generate rich-text document objects. These must inherit security restrictions via a relational workspaceId property.

FR3.2: Cascading Eviction

Specification: If a workspace container is destroyed by its primary owner, the backend must execute an atomic cascading deletion hook, evicting every sub-document pointing to that workspaceId.

## FR4: Real-Time Sync & Live Collaboration Engine
FR4.1: Low-Latency Operation Broadcast

Specification: The system must manage full-duplex TCP communication channels via Socket.io. When an editor alters a document canvas, the client must emit an operational delta payload.

FR4.2: Shared State Synchronization

Specification: Upon capturing a client-side text modification, Socket.io workers backed by a Redis Pub/Sub communication bus must instantly broadcast the mutations to all other peer sockets subscribed to that specific document channel room.

FR4.3: Real-Time Presence & Viewer Aggregation

Specification: The network layer must track online availability and document focus:

Entering a document appends a user's ID to a fast Redis Set container (doc:room:<docId>:users) to render live active avatar headers.

Leaving or dropping connection must drop the socket ID and trigger a Redis TTL expiry cleanup routine to reflect an offline state.

## Non-functional reqirement == all the performance based requirement to make the application more fast and reliable on the user end.

NFR1 = Performance
    Document changes should appear within 1 second.

NFR2 = Scalability
    The system should support multiple workspaces and concurrent users.

NFR3 = Security
    Passwords must be hashed.JWT authentication shall be implemented.

NFR4 = Reliability
    Document data shall be stored reliably without loss.

NFR5 = Availability
    The system should remain operational during normal usage.

## Future Scope
    Comments
    Notifications
    Version History
    Rich Text Editor
    AI Assistant
    Mobile Application

## MVP Scope

    Version 1 will include:

    Authentication
    Workspace Management
    Document Management
    Real-Time Collaboration
    Online Presence
    Docker Support
    Deployment