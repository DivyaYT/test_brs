// import Link from "next/link";
// export default function Home() {
//   return (
//     <div>
//       <h1>BRS System</h1>
//     </div>
//   );
// }

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
