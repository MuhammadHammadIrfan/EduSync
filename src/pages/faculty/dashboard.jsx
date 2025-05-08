import { requireRole } from "@/lib/requireRole"

export async function getServerSideProps(context) {
  return requireRole(context, "faculty")
}

export default function FacultyDashboard() {
    return(
        <>
            <h1>This is faculty dashboard</h1>
        </>
    )
}