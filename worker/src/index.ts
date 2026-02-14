/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


import { Resend } from "resend";

type Env = {
	RESEND_API_KEY: string;
	ALLOWED_ORIGIN: string;
	TO_EMAIL: string;
	FROM_EMAIL: string;
};

type ContactBody = {
	name: string;
	email: string;
	message: string;
};

function corsHeaders(origin: string) {
	return {
		"Access-Control-Allow-Origin": origin,
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Vary": "Origin",
	};
}

function escapeHtml(s: string) {
	return s
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function readJson<T>(req: Request): Promise<T | null> {
	try {
		return (await req.json()) as T;
	} catch {
		return null;
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const origin = request.headers.get("Origin") ?? "";

		const allowedOrigins = new Set([
			env.ALLOWED_ORIGIN,
			"https://ryearmstrong.com",
			"https://www.ryearmstrong.com",
			"http://localhost:5173",
			"http://127.0.0.1:5173",
		]);

		const originAllowed = origin === "" || allowedOrigins.has(origin);

		// cors preflight
		if (request.method === "OPTIONS") {
			if (!originAllowed) return new Response("Forbidden", { status: 403 });
			return new Response(null, { status: 204, headers: corsHeaders(origin) });
		}

		if (request.method !== "POST") return new Response("Not found", { status: 404 });
		if (!originAllowed) return new Response("Forbidden", { status: 403 });

		let body: Partial<ContactBody> | null = null;
		const ct = request.headers.get("Content-Type") ?? "";

		if (ct.includes("application/json")) {
		body = await readJson<Partial<ContactBody>>(request);
		} else if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
		const form = await request.formData();
		body = {
			name: String(form.get("name") ?? ""),
			email: String(form.get("email") ?? ""),
			message: String(form.get("message") ?? ""),
		};
		}

		if (!body) {
		return new Response(JSON.stringify({ ok: false, error: "Invalid body (expected JSON)" }), {
			status: 400,
			headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
		});
		}

		const company = (body as any).company?.toString().trim() ?? "";
		if (company) {
		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
		});
		}

		const name = (body.name ?? "").toString().trim();
		const email = (body.email ?? "").toString().trim();
		const message = (body.message ?? "").toString().trim();

		if (!name || !email || !message) {
			return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), {
				status: 400,
				headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      		});
		}

		if (!isValidEmail(email)) {
			return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), {
				status: 400,
				headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
			});
		}
		if (message.length > 5000) {
			return new Response(JSON.stringify({ ok: false, error: "Message too long" }), {
				status: 400,
				headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
			});
		}

		const resend = new Resend(env.RESEND_API_KEY);

		const subject = `Portfolio contact from ${name}`;
		const html=`
			<p><b>Name:</b> ${escapeHtml(name)}</p>
			<p><b>Email:</b> ${escapeHtml(email)}</p>
      		<p><b>Message:</b></p>
      		<pre style="white-space:pre-wrap">${escapeHtml(message)}</pre>`;
		
		try {
			const { data, error } = await resend.emails.send({
				from: env.FROM_EMAIL,
				to: env.TO_EMAIL,
				subject,
				replyTo: email,
				html,
			});

			if (error) {
				return new Response(JSON.stringify({ ok: false, error: error.message ?? error }), {
          			status: 502,
          			headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
       			});
			}

			return new Response(JSON.stringify({ ok: true, id: data?.id }), {
				status: 200,
				headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
			});
		} catch(e) {
			return new Response(JSON.stringify({ ok: false, error: "Send failed"}), {
				status: 502,
				headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
			});
		}
	},
};