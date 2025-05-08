import { requireRole } from "@/lib/requireRole"

export async function getServerSideProps(context) {
  return requireRole(context, "admin")
}


export default function AdminDashboard() {
    return(
        <>
            <h1>This is admin Users</h1>
        </>
    )
}