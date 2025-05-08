import { requireRole } from "@/lib/requireRole"

export async function getServerSideProps(context) {
  return requireRole(context, "student")
}

export default function StudentDashboard() {
    return(
        <>
            <h1>This is student dashboard</h1>
        </>
    )
}