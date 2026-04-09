import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Kanban, ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Kanban className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">Flowboard</span>
        </div>

        <div className="rounded-xl border bg-card p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                <Check className="w-5 h-5 text-success" />
              </div>
              <h1 className="text-lg font-semibold text-foreground mb-1">Check your email</h1>
              <p className="text-sm text-muted-foreground">We sent a reset link to {email}</p>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-foreground mb-1">Reset your password</h1>
              <p className="text-sm text-muted-foreground mb-6">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5" />
                </div>
                <Button type="submit" className="w-full">Send reset link</Button>
              </form>
            </>
          )}
        </div>

        <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-4 hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
