export interface EditReferenceLinkFormProps {
    type: string
    link_id: string
    link_name: string
    link_url: string
    setReferences: (references: any) => void;
}
