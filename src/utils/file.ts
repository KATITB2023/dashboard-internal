import axios, { type AxiosProgressEvent } from 'axios';
import sanitize from 'sanitize-filename';
import { v4 as uuidv4 } from 'uuid';
import { env } from '~/env.mjs';

export enum Lembaga {
  HMJ = 'HMJ',
  UKM = 'UKM',
  BSO = 'BSO',
  PUSAT = 'PUSAT'
}

export const sanitizeURL = (url: string) => {
  const lastPathIndex = url.lastIndexOf('/');
  const lastPath = url.substring(lastPathIndex + 1);

  const sanitizedLastPath = `${uuidv4()}-${sanitize(lastPath)}`;
  const sanitizedURL = url.replace(lastPath, sanitizedLastPath);

  return sanitizedURL;
};

export const uploadFile = async (
  url: string,
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const axiosInstance = axios.create();
  const data = new FormData();
  data.append('file', file);

  await axiosInstance.put<null>(url, data, {
    headers: {
      'api-key': env.NEXT_PUBLIC_BUCKET_API_KEY
    },
    onUploadProgress
  });
};

export const deleteFile = async (url: string) => {
  const axiosInstance = axios.create();

  await axiosInstance.delete<null>(url, {
    headers: {
      'api-key': env.NEXT_PUBLIC_BUCKET_API_KEY
    }
  });
};
