import { getTracks, getUserProgress } from "@/db/queries";
import { TrackList } from "./list";

const TracksPage = async () => {
  const tracksData = getTracks();
  const userProgressData = getUserProgress();

  const [tracks, userProgress] = await Promise.all([
    tracksData,
    userProgressData,
  ]);

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700">
        Learning Tracks
      </h1>
      <p className="text-neutral-500 mt-1 mb-6">
        Choose the right track for each family member — age-appropriate content
        for kids, teens, and adults.
      </p>
      <TrackList
        tracks={tracks}
        activeTrackId={userProgress?.activeTrackId}
      />
    </div>
  );
};

export default TracksPage;
