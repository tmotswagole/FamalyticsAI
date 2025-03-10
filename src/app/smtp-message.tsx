export default function SMTPMessage() {
  return (
    <div className="p-4 border border-blue-200 bg-blue-50 rounded-md text-blue-800 mb-6">
      <h3 className="font-medium mb-2">Development Mode</h3>
      <p className="text-sm">
        In development, password reset emails are not sent. Instead, check the
        server console for the magic link.
      </p>
    </div>
  );
}
