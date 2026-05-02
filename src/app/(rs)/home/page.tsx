import { redirect } from "next/navigation";
import Loading from "@/app/loading";
export const metadata = {
  title: "Home",
};
export default function Home() {
  return <Loading />;
}
