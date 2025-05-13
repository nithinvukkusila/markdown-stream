import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const filePath = path.join(process.cwd(), 'public', 'sample.md');
  const file = fs.readFileSync(filePath, 'utf-8');
  const lines = file.split('\n');

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let i = 0;

      function sendLine() {
        if (i >= lines.length) {
          // Send a special message to indicate end of stream
          controller.enqueue(encoder.encode('data: [DONE]\n\n')); // Send done signal
          controller.close();
          return;
        }

        const line = lines[i];
        const event = `data: ${line}\n\n`;
        controller.enqueue(encoder.encode(event));
        i++;

        setTimeout(sendLine, 300); // Delay to simulate streaming
      }

      sendLine();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
