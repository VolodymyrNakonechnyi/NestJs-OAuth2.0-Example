import { TemplateDelegate } from "handlebars";
import { ITemplatedData } from "./templated-data.interface";


export interface ITemplates {
    confirmation: TemplateDelegate<ITemplatedData>,
    resetPassword: TemplateDelegate<ITemplatedData>
}