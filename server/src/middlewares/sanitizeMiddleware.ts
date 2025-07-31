import sanitize from "sanitize-html";
import { Request, Response, NextFunction } from "express";

function deepSanitize(obj: any): any {
  if (typeof obj === "string") {
    return sanitize(obj, {
      allowedTags: [],
      allowedAttributes: {}
    });
  }

  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  }

  if (typeof obj === "object" && obj !== null) {
    const sanitizedObj = {} as any;
    for (const key in obj) {
      sanitizedObj[key] = deepSanitize(obj[key]);
    }
    return sanitizedObj;
  }

  return obj;
}

const sanitizeBody = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = deepSanitize(req.body);
  }
  next();
};

export { sanitizeBody };
