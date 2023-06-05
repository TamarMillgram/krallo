import { BsPaperclip } from "react-icons/bs"
import { UserImg } from "../user-img"

export function TaskAttachments({ task }) {
    const { title, attachments } = task
    console.log(attachments)
    // if (!attachments) return
    return (
        <section className="task-attachments">
            <div className="attachment-title flex align-center">
                <BsPaperclip />
                <h3>Attachments</h3>
            </div>
            <ul className="flex column clean-list">
                {attachments?.length && attachments.map((attachment, idx) =>
                    <li key={idx}>
                        {/* <UserImg /> */}
                        <img src={attachment} alt={title} />
                    </li>
                )}
            </ul>
        </section>
    )
}