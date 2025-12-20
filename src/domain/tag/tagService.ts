import { client } from '@/config/axiosConfig';
import { endpoints } from '@/config/endpoints';
import { transformResponseFactory } from '@/utils/serviceUtils';
import { parseLocationResponse } from '../location';
import { parseTagResponse } from './tagParser';
import type { Tag, TagRequest } from './tagSchemaTypes';

export async function readTags(): Promise<Tag[]> {
    const endpoint = endpoints.tags.list;

    const transformResponse = transformResponseFactory(parseTagResponse);

    const { data } = await client.get(endpoint, { transformResponse });

    return data;
}

export async function createTag(body: TagRequest): Promise<Tag> {
    const endpoint = endpoints.tags.create;

    const transformResponse = parseTagResponse;

    const { data } = await client.post(endpoint, body, { transformResponse });

    return data;
}

export async function updateTag(tagId: number, body: Partial<TagRequest>): Promise<Tag> {
    const endpoint = endpoints.tags.update.replace('{id}', tagId.toString());

    const transformResponse = parseTagResponse;

    const { data } = await client.patch(endpoint, body, { transformResponse });

    return data;
}

export async function deleteTag(tagId: number): Promise<void> {
    const endpoint = endpoints.tags.delete.replace('{id}', tagId.toString());

    await client.delete(endpoint);
}

export async function setLocationTags(locationId: number, tagIds: number[]): Promise<Location> {
    const endpoint = endpoints.locations.tags.set.replace('{id}', locationId.toString());

    const transformResponse = parseLocationResponse;

    const { data } = await client.put(endpoint, { tags: tagIds }, { transformResponse });

    return data;
}
