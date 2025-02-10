import { basename, extname } from '@std/path';
import { contentType } from '@std/media-types';
import { FileAttachment } from '../types/attachment.ts';

export default class Attachment {
  #path: string;
  #name: string;
  #title?: string;
  #description?: string;
  #data: Uint8Array;

  constructor(path: string, options?: {
    name?: string,
    title?: string,
    description?: string
  }) {
    this.#path = path;
    this.#name = options?.name || basename(path);
    this.#title = options?.title;
    this.#description = options?.description;

    this.#data = Deno.readFileSync(path);
  }

  getName(): string {
    return this.#name;
  }

  getTitle(): string | undefined  {
    return this.#title;
  }

  getDescription(): string | undefined  {
    return this.#description;
  }

  getExt(): string {
    return extname(this.#path);
  }

  getContentType(): string | undefined {
    return contentType(this.getExt());
  }

  getPath(): string {
    return this.#path;
  }

  getData(): Uint8Array {
    return this.#data;
  }

  toBlob(): Blob {
    return new Blob([this.#data.buffer], {
      type: this.getContentType() || 'text/plain'
    });
  }

  toJSON(id: number): FileAttachment {
    return {
      id,
      filename: this.#name,
      title: this.#title,
      description: this.#description
    }
  }
}

/*
  await channel.sendMessage({
    files: [new File('./document.txt')]
  });
 */