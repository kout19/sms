import CreateExamModal from "./CreateExamModal";

export default function EditExamModal({ isOpen, onClose, onSaved, exam }) {
  return (
    <CreateExamModal
      isOpen={isOpen}
      onClose={onClose}
      onSaved={onSaved}
      exam={exam}
    />
  );
}
