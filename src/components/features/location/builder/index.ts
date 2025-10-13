export type BuilderStep = 'basics' | 'images' | 'settings';

export type SubmissionStep = 'idle' | 'loading' | 'completed' | 'error';

export type BuilderSubstep = {
    isCompleted: boolean;
    label: string;
};
