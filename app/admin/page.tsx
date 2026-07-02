import { AdminDashboard } from "@/app/admin/admin-dashboard";
import {
  getAllPhotoStories,
  getAllTributes,
  getGuestBookStats,
  siteSettings
} from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [guestBookStats, tributes, photoStories] = await Promise.all([
    getGuestBookStats(),
    getAllTributes(),
    getAllPhotoStories()
  ]);

  return (
    <AdminDashboard
      guestBookStats={guestBookStats}
      tributes={tributes}
      photoStories={photoStories}
      homepageQuote={siteSettings.homepageQuote}
    />
  );
}
