import { requireRole } from "@/lib/requireRole"

export async function getServerSideProps(context) {
  return requireRole(context, "student")
}


export default function StudentTimetable() {
    return(
        <>
            <h1>This is student timetable</h1>
        </>
    )
}