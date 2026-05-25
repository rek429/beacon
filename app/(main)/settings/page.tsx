import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs";
import { getUserProgress } from "@/db/queries";
import { FamilySetup } from "./family-setup";

const SettingsPage = async () => {
  const { userId } = auth();
  const user = await currentUser();
  const userProgress = await getUserProgress();

  if (!userId || !user) redirect("/");
  if (!userProgress) redirect("/tracks");

  return (
    <div className="max-w-2xl mx-auto px-4 pb-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
      <p className="text-gray-500 mb-8">Manage your account and family.</p>
      <FamilySetup
        userId={userId}
        userName={user.firstName ?? "User"}
        currentFamilyId={userProgress.familyId}
        currentFamilyName={(userProgress as any).familyName}
        currentRole={userProgress.familyRole}
      />
    </div>
  );
};

export default SettingsPage;