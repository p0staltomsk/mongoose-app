import * as mongoose from 'mongoose';
export declare const Element: mongoose.Model<{
    symbol: string;
    atomicNumber: number;
    name: string;
    atomicMass: number;
    category: string;
    color?: string | null | undefined;
    description?: string | null | undefined;
    customProperties?: Map<string, any> | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    symbol: string;
    atomicNumber: number;
    name: string;
    atomicMass: number;
    category: string;
    color?: string | null | undefined;
    description?: string | null | undefined;
    customProperties?: Map<string, any> | null | undefined;
}> & {
    symbol: string;
    atomicNumber: number;
    name: string;
    atomicMass: number;
    category: string;
    color?: string | null | undefined;
    description?: string | null | undefined;
    customProperties?: Map<string, any> | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    symbol: string;
    atomicNumber: number;
    name: string;
    atomicMass: number;
    category: string;
    color?: string | null | undefined;
    description?: string | null | undefined;
    customProperties?: Map<string, any> | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    symbol: string;
    atomicNumber: number;
    name: string;
    atomicMass: number;
    category: string;
    color?: string | null | undefined;
    description?: string | null | undefined;
    customProperties?: Map<string, any> | null | undefined;
}>> & mongoose.FlatRecord<{
    symbol: string;
    atomicNumber: number;
    name: string;
    atomicMass: number;
    category: string;
    color?: string | null | undefined;
    description?: string | null | undefined;
    customProperties?: Map<string, any> | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
