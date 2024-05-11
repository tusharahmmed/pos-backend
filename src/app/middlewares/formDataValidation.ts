/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

const formDataValidation =
  (
    schema: AnyZodObject | ZodEffects<AnyZodObject>
    //  controller: any
  ) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { data } = req.body;
      await schema.parseAsync({
        body: JSON.parse(data),
      });
      // return controller(req, res, next);
      return next();
    } catch (error) {
      next(error);
    }
  };

export default formDataValidation;
