import { Injectable } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";
import * as  path from "path";

@Injectable()
export class UploadService{
    private storage:Storage;
    private bucketName:string="flixdb-51";

    constructor(){
        this.storage=new Storage({
            keyFilename:path.join(__dirname,"../../gcp/flixdb-project-1832730228a8.json"),
            projectId:"flixdb-project"
        })
    }

    async uploadImage(file:Express.Multer.File):Promise<string>{
        const bucket=this.storage.bucket(this.bucketName);
        const blob=bucket.file(file.originalname);
        const blobStream=blob.createWriteStream({
            resumable:false
        });
        return new Promise((resolve,reject)=>{
            blobStream.on("finish",()=>{
                const publicUrl=`https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
                resolve(publicUrl);
            })
            .on("error",(err)=>{
                reject(err);
            })
            .end(file.buffer);
        });
    }
}
