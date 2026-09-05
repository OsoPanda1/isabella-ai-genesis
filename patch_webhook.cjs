const fs = require('fs');
let code = fs.readFileSync('src/routes/api/billing.ts', 'utf8');

// Replace the webhook block
const oldWebhookBlock = `          // 2. WEBHOOK (REAL STRIPE)
          if (action === "webhook") {
            const stripe = getStripe();
            let eventType = body?.type || "checkout.session.completed";
            let metadata = body?.metadata || {};
            let clientReferenceId = body?.client_reference_id || "";

            // Si Stripe está activo y recibimos firmas reales, verificamos
            const signature = request.headers.get("stripe-signature");
            if (stripe && signature) {
              try {
                const endpointSecret =
                  (config() as unknown as Record<string, string>).STRIPE_WEBHOOK_SECRET || "";
                const verifiedEvent = stripe.webhooks.constructEvent(
                  bodyText,
                  signature,
                  endpointSecret,
                );
                eventType = verifiedEvent.type;
                const sessionObject = verifiedEvent.data.object as unknown as Record<
                  string,
                  unknown
                >;
                metadata = (sessionObject.metadata as Record<string, string>) || {};
                clientReferenceId = (sessionObject.client_reference_id as string) || "";
              } catch (verificationError: unknown) {
                const errorMsg =
                  verificationError instanceof Error
                    ? verificationError.message
                    : String(verificationError);
                console.error("Firma Webhook Stripe inválida:", errorMsg);
                return new Response(JSON.stringify({ error: "Fallo de validación de firma." }), {
                  status: 400,
                  headers,
                });
              }
            }`;

const newWebhookBlock = `          // 2. WEBHOOK (REAL STRIPE)
          if (action === "webhook") {
            const stripe = getStripe();
            const signature = request.headers.get("stripe-signature");
            
            if (!stripe || !signature) {
              return new Response(JSON.stringify({ error: "Webhook requires Stripe configuration and signature." }), {
                  status: 400,
                  headers,
              });
            }

            let eventType;
            let metadata = {};
            let clientReferenceId = "";

            try {
              const endpointSecret = (config() as unknown as Record<string, string>).STRIPE_WEBHOOK_SECRET || "";
              const verifiedEvent = stripe.webhooks.constructEvent(
                bodyText,
                signature,
                endpointSecret,
              );
              eventType = verifiedEvent.type;
              const sessionObject = verifiedEvent.data.object as unknown as Record<
                string,
                unknown
              >;
              metadata = (sessionObject.metadata as Record<string, string>) || {};
              clientReferenceId = (sessionObject.client_reference_id as string) || "";
            } catch (verificationError: unknown) {
              const errorMsg =
                verificationError instanceof Error
                  ? verificationError.message
                  : String(verificationError);
              console.error("Firma Webhook Stripe inválida:", errorMsg);
              return new Response(JSON.stringify({ error: "Fallo de validación de firma." }), {
                status: 400,
                headers,
              });
            }`;

code = code.replace(oldWebhookBlock, newWebhookBlock);
fs.writeFileSync('src/routes/api/billing.ts', code);
