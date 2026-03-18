import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  UseGuards, UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto, DocumentFilterDto } from './dto/document.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { TenantGuard } from '../../../auth/guards/tenant.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { TenantId, CurrentUser } from '../../../auth/decorators/user.decorator';
import { User } from '../../../database/entities/user.entity';
import { UserRole } from '../../../common/enums';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

@ApiTags('agency')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(UserRole.AGENCY_OWNER)
@Controller('agency/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll(@TenantId() agencyId: string, @Query() filters: DocumentFilterDto) {
    return this.documentsService.findAll(agencyId, filters);
  }

  @Get(':id')
  findOne(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.documentsService.findOne(agencyId, id);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload de arquivo + salvar documento' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        category: { type: 'string' },
        clientId: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: UPLOAD_DIR,
      filename: (_req, file, cb) => cb(null, `${uuidv4()}${extname(file.originalname)}`),
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
  }))
  async uploadDocument(
    @TenantId() agencyId: string,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');

    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;

    const dto: CreateDocumentDto = {
      name: body.name || file.originalname,
      fileUrl,
      fileType: extname(file.originalname).replace('.', ''),
      fileSize: file.size,
      category: body.category,
      clientId: body.clientId,
      description: body.description,
    };

    return this.documentsService.create(agencyId, dto, user.id);
  }

  @Post()
  create(@TenantId() agencyId: string, @Body() dto: CreateDocumentDto, @CurrentUser() user: User) {
    return this.documentsService.create(agencyId, dto, user.id);
  }

  @Patch(':id')
  update(@TenantId() agencyId: string, @Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.documentsService.update(agencyId, id, dto);
  }

  @Delete(':id')
  remove(@TenantId() agencyId: string, @Param('id') id: string) {
    return this.documentsService.remove(agencyId, id);
  }
}
