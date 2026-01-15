import { WorkerEntrypoint } from "cloudflare:workers";

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    // 1. API Handling (Dynamic)
    if (url.pathname.startsWith("/api/")) {
      try {
        // Example: Route to specific handlers
        if (url.pathname === "/api/health") {
          return new Response(JSON.stringify({ status: "healthy" }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        
        // Add your DB calls here (e.g., env.DB.prepare(...))
        
        return new Response("Endpoint not found", { status: 404 });
      } catch (err) {
        console.error(err);
        return new Response("Internal Error", { status: 500 });
      }
    }

    // 2. Static Asset Handling (SPA)
    // This automatically handles index.html fallback for client-side routing
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
