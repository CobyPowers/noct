import { HTTPMethod } from 'nocular';
import Attachment from '../structures/Attachment.ts';

export default class Route {
  BUCKET_RESOURCES = [
    'channelID',
    'guildID',
    'webhookID',
    'webhookToken'
  ]

  readonly path: string;
  readonly bucketPath: string;
  readonly method: HTTPMethod;
  readonly reason?: string;
  readonly resources?: Record<string, string>;
  readonly params?: Record<string, string | number | undefined>;
  readonly data?: any;

  constructor(options: {
    path: string,
    method: HTTPMethod,
    reason?: string,
    resources?: Record<string, string>,
    params?: Record<string, string | number | undefined>,
    files?: Attachment[],
    data?: any
  }) {
    const { path, method, reason, resources, params, files, data } = options;

    this.path = path;
    this.bucketPath = path;
    this.reason = reason;
    this.method = method;
    this.resources = resources;
    this.params = params;

    if (files) {
      const formData = new FormData();

      // since we are manually processing the files here (route),
      // there is no need to pass them into the form body
      delete data.files;

      formData.append('payload_json', JSON.stringify({
        ...data,
        attachments: files.map((file, i) => {
          return file.toJSON(i);
        })
      }));

      files.forEach((file, i) => {
        formData.append(`files[${i}]`, file.toBlob(), file.getName());
      })

      this.data = formData;
    } else {
      this.data = data;
    }

    if (resources) {
      for (const [k, v] of Object.entries(resources)) {
        if (this.BUCKET_RESOURCES.includes(k)) 
          this.bucketPath = this.bucketPath.replace(`{${k}}`, v);

        this.path = this.path.replace(`{${k}}`, v);
      }
    }
  }

  getBucketID(): string {
    return this.method.toUpperCase() + this.bucketPath;
  }
}
