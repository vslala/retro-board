import BoardTemplate, {BoardTemplates} from "../../models/BoardTemplate";
import {request} from "../../env-config";

class TemplateService {

    public static getInstance() {
        return new TemplateService();
    }

    public async createBoardTemplate(boardTemplate: BoardTemplate) {
        let response = await request.post(`/templates`, boardTemplate);
        if (201 === response.status) {
            let templateResponse = await request.get(response.headers.location);
            return templateResponse.data as BoardTemplate;
        }

        throw Error("Cannot create template. There is some error in the backend. Status Code: " + response.status);
    }

    public async getBoardTemplates() {
        let response = await request.get(`/templates`);
        if (200 === response.status) {
            return response.data as BoardTemplates;
        }

        throw Error("Error fetching templates. Status: " + response.status);
    }

    public async deleteBoardTemplate(boardTemplate: BoardTemplate) {
        let response = await request.delete(`/templates/${boardTemplate.templateId}`);
        if (204 === response.status) {
            return;// delete successful
        }

        throw Error("Error deleting template. Status: " + response.status);
    }
}

export default TemplateService;