"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createFamily, joinFamily, leaveFamily } from "@/actions/family";

type Props = {
  userId: string;
  userName: string;
  currentFamilyId?: string | null;
  currentFamilyName?: string | null;
  currentRole: string;
};

export const FamilySetup = ({
  userId,
  userName,
  currentFamilyId,
  currentFamilyName,
  currentRole,
}: Props) => {
  const [pending, startTransition] = useTransition();
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [role, setRole] = useState("PARENT");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    if (!familyName.trim()) return toast.error("Please enter a family name");
    startTransition(() => {
      createFamily(familyName.trim(), role)
        .then((code) => {
          setGeneratedCode(code);
          toast.success("Family created!");
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const handleJoin = () => {
    if (!inviteCode.trim()) return toast.error("Please enter an invite code");
    startTransition(() => {
      joinFamily(inviteCode.trim().toUpperCase(), role)
        .then(() => toast.success("Joined family!"))
        .catch((e) => toast.error(e.message ?? "Invalid invite code"));
    });
  };

  const handleLeave = () => {
    startTransition(() => {
      leaveFamily()
        .then(() => toast.success("Left family"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Already in a family
  if (currentFamilyId) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-1">
            👨‍👩‍👧‍👦 {currentFamilyName ?? "Your Family"}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            You are a <span className="font-semibold text-[#6B6FD4] capitalize">{currentRole.toLowerCase()}</span> in this family.
          </p>
          <InviteSection familyId={currentFamilyId} />
          <button
            onClick={handleLeave}
            disabled={pending}
            className="mt-6 text-sm text-red-500 hover:underline disabled:opacity-50"
          >
            Leave family
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create a family */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Create a family</h2>
        <p className="text-sm text-gray-500 mb-4">
          Start a family group and invite members with a code.
        </p>
        <div className="space-y-3">
          <input
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="e.g. The Johnsons"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B6FD4]/30"
          />
          <RoleSelect value={role} onChange={setRole} />
          <button
            onClick={handleCreate}
            disabled={pending}
            className="w-full bg-[#6B6FD4] hover:bg-[#5558C8] text-white font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50"
          >
            Create Family
          </button>
        </div>

        {generatedCode && (
          <div className="mt-4 p-4 bg-[#6B6FD4]/10 rounded-xl border border-[#6B6FD4]/20">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Share this code with family members:
            </p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold tracking-widest text-[#6B6FD4]">
                {generatedCode}
              </span>
              <button
                onClick={() => copyCode(generatedCode)}
                className="text-xs bg-white border border-[#6B6FD4]/30 text-[#6B6FD4] px-3 py-1.5 rounded-lg font-medium hover:bg-[#6B6FD4]/5"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Join a family */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Join a family</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter the invite code shared by your family.
        </p>
        <div className="space-y-3">
          <input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="e.g. ABC123"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B6FD4]/30 tracking-widest font-mono"
            maxLength={6}
          />
          <RoleSelect value={role} onChange={setRole} />
          <button
            onClick={handleJoin}
            disabled={pending}
            className="w-full bg-[#6B6FD4] hover:bg-[#5558C8] text-white font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50"
          >
            Join Family
          </button>
        </div>
      </div>
    </div>
  );
};

const RoleSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B6FD4]/30 bg-white"
  >
    <option value="PARENT">Parent</option>
    <option value="TEEN">Teen (13–17)</option>
    <option value="CHILD">Child (6–12)</option>
  </select>
);

const InviteSection = ({ familyId }: { familyId: string }) => {
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const getCode = () => {
    startTransition(() => {
      fetch("/api/family/invite", {
        method: "POST",
        body: JSON.stringify({ familyId }),
        headers: { "Content-Type": "application/json" },
      })
        .then((r) => r.json())
        .then((d) => setCode(d.code));
    });
  };

  const copy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {!code ? (
        <button
          onClick={getCode}
          disabled={pending}
          className="text-sm bg-[#6B6FD4]/10 text-[#6B6FD4] font-medium px-4 py-2 rounded-xl hover:bg-[#6B6FD4]/20 transition-all"
        >
          Generate invite code
        </button>
      ) : (
        <div className="p-4 bg-[#6B6FD4]/10 rounded-xl border border-[#6B6FD4]/20">
          <p className="text-sm text-gray-600 mb-2 font-medium">Share this code:</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-widest text-[#6B6FD4]">{code}</span>
            <button
              onClick={copy}
              className="text-xs bg-white border border-[#6B6FD4]/30 text-[#6B6FD4] px-3 py-1.5 rounded-lg font-medium"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};