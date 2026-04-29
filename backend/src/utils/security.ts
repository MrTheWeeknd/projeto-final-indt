import crypto from "node:crypto";

const PASSWORD_PREFIX = "scrypt";
const DEFAULT_HASH_KEYLEN = 64;
const DEFAULT_TOKEN_EXPIRATION = "8h";

type JwtPayload = {
    sub: string;
    email: string;
    iat: number;
    exp: number;
};

function toBase64Url(value: string | Buffer): string {
    const buffer = typeof value === "string" ? Buffer.from(value) : value;
    return buffer.toString("base64url");
}

function fromBase64Url(value: string): string {
    return Buffer.from(value, "base64url").toString("utf8");
}

function criarAssinatura(conteudo: string, secret: string): string {
    return toBase64Url(crypto.createHmac("sha256", secret).update(conteudo).digest());
}

export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = await new Promise<Buffer>((resolve, reject) => {
        crypto.scrypt(password, salt, DEFAULT_HASH_KEYLEN, (error, key) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(key as Buffer);
        });
    });

    return `${PASSWORD_PREFIX}$${salt}$${derivedKey.toString("hex")}`;
}

export function isPasswordHash(value: string): boolean {
    return value.startsWith(`${PASSWORD_PREFIX}$`);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    if (!isPasswordHash(hashedPassword)) {
        return false;
    }

    const [, salt, storedHash] = hashedPassword.split("$");

    if (!salt || !storedHash) {
        return false;
    }

    const candidateKey = await new Promise<Buffer>((resolve, reject) => {
        crypto.scrypt(password, salt, DEFAULT_HASH_KEYLEN, (error, key) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(key as Buffer);
        });
    });

    const storedBuffer = Buffer.from(storedHash, "hex");

    if (storedBuffer.length !== candidateKey.length) {
        return false;
    }

    return crypto.timingSafeEqual(storedBuffer, candidateKey);
}

function parseExpirationToSeconds(expiresIn: string): number {
    const match = expiresIn.trim().match(/^(\d+)([smhd])$/i);

    if (!match) {
        throw new Error("Formato de expiracao JWT invalido");
    }

    const rawValue = match[1];
    const rawUnit = match[2];

    if (!rawValue || !rawUnit) {
        throw new Error("Formato de expiracao JWT invalido");
    }

    const multiplierByUnit = {
        s: 1,
        m: 60,
        h: 60 * 60,
        d: 60 * 60 * 24,
    } as const;

    const value = Number(rawValue);
    const unit = rawUnit.toLowerCase() as keyof typeof multiplierByUnit;

    return value * multiplierByUnit[unit];
}

export function signJwt(payload: { sub: string; email: string }, secret: string, expiresIn = DEFAULT_TOKEN_EXPIRATION): string {
    const header = {
        alg: "HS256",
        typ: "JWT",
    };

    const issuedAt = Math.floor(Date.now() / 1000);
    const expirationInSeconds = parseExpirationToSeconds(expiresIn);
    const fullPayload: JwtPayload = {
        ...payload,
        iat: issuedAt,
        exp: issuedAt + expirationInSeconds,
    };

    const encodedHeader = toBase64Url(JSON.stringify(header));
    const encodedPayload = toBase64Url(JSON.stringify(fullPayload));
    const signature = criarAssinatura(`${encodedHeader}.${encodedPayload}`, secret);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJwt(token: string, secret: string): JwtPayload {
    const [encodedHeader, encodedPayload, signature] = token.split(".");

    if (!encodedHeader || !encodedPayload || !signature) {
        throw new Error("Token malformado");
    }

    const expectedSignature = criarAssinatura(`${encodedHeader}.${encodedPayload}`, secret);
    const receivedSignature = Buffer.from(signature, "utf8");
    const computedSignature = Buffer.from(expectedSignature, "utf8");

    if (receivedSignature.length !== computedSignature.length || !crypto.timingSafeEqual(receivedSignature, computedSignature)) {
        throw new Error("Assinatura JWT invalida");
    }

    const payload = JSON.parse(fromBase64Url(encodedPayload)) as JwtPayload;

    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
        throw new Error("Token expirado");
    }

    return payload;
}
