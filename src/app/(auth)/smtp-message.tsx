export function SmtpMessage() {
  return (
    <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-md text-blue-800 text-sm w-full max-w-md">
      <h3 className="font-medium mb-1">Development Mode</h3>
      <p>
        In development, password reset emails are not sent. Check the server
        console for the magic link.
      </p>
    </div>
  );
}
