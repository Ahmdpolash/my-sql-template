import fs from "fs";
import path from "path";

// Capitalize internal names
function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Template generator for CRUD-ready module
function getTemplate(fileName: string, moduleName: string): string {
  const capitalized = capitalize(moduleName);
  const baseName = path
    .basename(fileName, path.extname(fileName))
    .toLowerCase();

  switch (baseName) {
    case `${moduleName}.controller`:
      return `// Controller: Handles HTTP requests for the ${capitalized} module.
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ${capitalized}Service } from "./${moduleName}.service";

// Create
const create${capitalized} = catchAsync(async (req: Request, res: Response) => {
  const result = await ${capitalized}Service.create${capitalized}InDB(req.body);
  sendResponse(res, { statusCode: 201, message: "${capitalized} created", data: result });
});

// Get All
const getAll${capitalized} = catchAsync(async (req: Request, res: Response) => {
  const result = await ${capitalized}Service.getAll${capitalized}s();
  sendResponse(res, { statusCode: 200, message: "Fetched all ${capitalized}s", data: result });
});

// Get by ID
const get${capitalized}ById = catchAsync(async (req: Request, res: Response) => {
  const result = await ${capitalized}Service.get${capitalized}ById(req.params.id);
  sendResponse(res, { statusCode: 200, message: "Fetched ${capitalized}", data: result });
});

// Update
const update${capitalized} = catchAsync(async (req: Request, res: Response) => {
  const result = await ${capitalized}Service.update${capitalized}(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, message: "${capitalized} updated", data: result });
});

// Delete
const delete${capitalized} = catchAsync(async (req: Request, res: Response) => {
  const result = await ${capitalized}Service.delete${capitalized}(req.params.id);
  sendResponse(res, { statusCode: 200, message: "${capitalized} deleted", data: result });
});

export const ${capitalized}Controller = {
  create${capitalized},
  getAll${capitalized},
  get${capitalized}ById,
  update${capitalized},
  delete${capitalized},
};
`;

    case `${moduleName}.service`:
      return `// Service: Business logic for ${capitalized} module.
const create${capitalized}InDB = async (payload: any) => {
  // TODO: Add database logic
  return payload;
};

const getAll${capitalized}s = async () => {
  // TODO: Add DB fetch all
  return [];
};

const get${capitalized}ById = async (id: string) => {
  // TODO: Add DB fetch by id
  return { id, name: "Sample ${capitalized}" };
};

const update${capitalized} = async (id: string, payload: any) => {
  // TODO: Add DB update logic
  return { id, ...payload };
};

const delete${capitalized} = async (id: string) => {
  // TODO: Add DB delete logic
  return { id };
};

export const ${capitalized}Service = {
  create${capitalized}InDB,
  getAll${capitalized}s,
  get${capitalized}ById,
  update${capitalized},
  delete${capitalized},
};
`;

    case `${moduleName}.routes`:
      return `// Routes: CRUD endpoints for ${capitalized} module.
import { Router } from "express";
import { ${capitalized}Controller } from "./${moduleName}.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ${capitalized}Validation } from "./${moduleName}.validation";

const router = Router();

router.post("/", validateRequest(${capitalized}Validation.create${capitalized}ValidationSchema), ${capitalized}Controller.create${capitalized});
router.get("/", ${capitalized}Controller.getAll${capitalized});
router.get("/:id", ${capitalized}Controller.get${capitalized}ById);
router.put("/:id", validateRequest(${capitalized}Validation.update${capitalized}ValidationSchema), ${capitalized}Controller.update${capitalized});
router.delete("/:id", ${capitalized}Controller.delete${capitalized});

export const ${capitalized}Routes = router;
`;

    case `${moduleName}.validation`:
      return `// Validation: Zod schemas for ${capitalized} module
import { z } from "zod";

const create${capitalized}ValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "${capitalized} name is required"),
  }),
});

const update${capitalized}ValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "${capitalized} name is required").optional(),
  }),
});

export const ${capitalized}Validation = {
  create${capitalized}ValidationSchema,
  update${capitalized}ValidationSchema,
};
`;

    case `${moduleName}.interface`:
      return `// Interface: Type definition for ${capitalized}
export interface I${capitalized} {
  id?: string;
  name: string;
}
`;

    default:
      return `// Default template for ${capitalized}`;
  }
}

// Main function to create module
async function createModule(moduleName: string): Promise<void> {
  const capitalizedModuleName = capitalize(moduleName);
  const projectRoot = path.resolve(__dirname, "..");
  const moduleDir = path.join(projectRoot, "src", "app", "modules", moduleName);

  if (fs.existsSync(moduleDir)) {
    console.log(`❌ Module "${capitalizedModuleName}" already exists.`);
    return;
  }

  fs.mkdirSync(moduleDir, { recursive: true });

  const filesToCreate = [
    `${moduleName}.controller.ts`,
    `${moduleName}.service.ts`,
    `${moduleName}.routes.ts`,
    `${moduleName}.validation.ts`,
    `${moduleName}.interface.ts`,
  ];

  for (const fileName of filesToCreate) {
    const filePath = path.join(moduleDir, fileName);
    const content = getTemplate(fileName, moduleName);
    fs.writeFileSync(filePath, content);
  }

  console.log(
    `✅ Module "${capitalizedModuleName}" created with full CRUD at ${moduleDir}`
  );
}

// CLI argument parsing
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log(
    "⚠ Please provide a module name. Usage: npm run generate <moduleName>"
  );
  process.exit(1);
}

const moduleName = args[0].toLowerCase(); // enforce lowercase for file names
createModule(moduleName);
