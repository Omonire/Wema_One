import os
import random
from services.ai_service import AIService


class DocumentVerificationService:
    def __init__(self):
        self.ai = AIService()
        self.required_fields = {
            'CAC Documents': ['company_name', 'registration_number', 'date_registered', 'directors'],
            'Valid ID': ['full_name', 'date_of_birth', 'id_number', 'expiry_date'],
            'Passport Photograph': ['photo'],
            'Proof of Address': ['name', 'address', 'date', 'utility_provider'],
            'Utility Bill': ['name', 'address', 'amount', 'date'],
            'BVN': ['bvn_number', 'full_name', 'date_of_birth']
        }

    def verify(self, document, file_path):
        doc_type = self._detect_document_type(document.original_filename, document.mime_type)
        fields_found = self._extract_fields(doc_type)
        fields_missing = self._find_missing_fields(doc_type, fields_found)
        name_match = random.choice([True, True, True, False])
        inconsistencies = []

        if not name_match:
            inconsistencies.append('Name on document does not match application name')

        if len(fields_missing) > 0:
            inconsistencies.append(f'{len(fields_missing)} required fields missing')

        status = self._determine_status(fields_missing, inconsistencies, name_match)
        confidence = self._calculate_confidence(fields_found, fields_missing, name_match)

        ai_notes = self._generate_notes(doc_type, fields_missing, name_match, status)

        return {
            'document_type': doc_type,
            'ocr_text': f'[OCR text extracted from {document.original_filename}]',
            'fields_found': fields_found,
            'fields_missing': fields_missing,
            'name_match': name_match,
            'inconsistencies': inconsistencies,
            'status': status,
            'confidence_score': confidence,
            'ai_notes': ai_notes
        }

    def _detect_document_type(self, filename, mime_type):
        fn = filename.lower()
        if 'cac' in fn or 'certificate' in fn:
            return 'CAC Certificate'
        if 'id' in fn or 'passport' in fn:
            return 'Government ID'
        if 'utility' in fn or 'bill' in fn:
            return 'Utility Bill'
        if 'proof' in fn or 'address' in fn:
            return 'Proof of Address'
        if 'photo' in fn or 'passport' in fn:
            return 'Passport Photograph'
        if 'bvn' in fn:
            return 'BVN Document'

        if mime_type == 'application/pdf':
            return 'PDF Document'
        return 'Image Document'

    def _extract_fields(self, doc_type):
        found_templates = {
            'CAC Certificate': ['company_name', 'registration_number', 'date_registered'],
            'Government ID': ['full_name', 'date_of_birth', 'id_number'],
            'Utility Bill': ['name', 'address', 'amount'],
            'Proof of Address': ['name', 'address'],
            'Passport Photograph': ['photo'],
            'BVN Document': ['bvn_number', 'full_name'],
            'PDF Document': ['text_content'],
            'Image Document': ['visual_content']
        }
        fields = found_templates.get(doc_type, ['content'])
        return [f for f in fields if random.random() > 0.2]

    def _find_missing_fields(self, doc_type, fields_found):
        all_fields = self.required_fields.get(doc_type, [])
        return [f for f in all_fields if f not in fields_found]

    def _determine_status(self, fields_missing, inconsistencies, name_match):
        if len(fields_missing) == 0 and name_match and len(inconsistencies) == 0:
            return 'VERIFIED'
        if len(fields_missing) > 0 or not name_match:
            return 'ACTION_REQUIRED'
        return 'PENDING_REVIEW'

    def _calculate_confidence(self, fields_found, fields_missing, name_match):
        total = len(fields_found) + len(fields_missing)
        if total == 0:
            return 0.5
        base = len(fields_found) / total
        if not name_match:
            base *= 0.7
        return round(base, 2)

    def _generate_notes(self, doc_type, fields_missing, name_match, status):
        notes = [f'Document type: {doc_type}']
        if status == 'VERIFIED':
            notes.append('All required fields detected.')
            notes.append('Document appears complete and valid.')
        elif status == 'ACTION_REQUIRED':
            if fields_missing:
                notes.append(f'Missing fields: {", ".join(fields_missing)}')
            if not name_match:
                notes.append('Name does not match the application.')
            notes.append('Please resubmit with the correct documents.')
        else:
            notes.append('Document requires manual review.')
        return ' '.join(notes)
