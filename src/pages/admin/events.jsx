import { requireRole } from "@/lib/requireRole"

export async function getServerSideProps(context) {
  return requireRole(context, "admin")
}

export default function AdminEvents() {
    return(
        <>
            <h1>This is admin Events</h1>
        </>
    )
}