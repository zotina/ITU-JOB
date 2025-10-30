<?php

namespace App\Services\Util;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProfileImageService
{
    private $disk;

    
    private const ROLE_PREFIXES = [
        'etudiant' => 'ETU',
        'recruteur' => 'REC'
    ];

    public function __construct()
    {
        $this->disk = env('attachments_disk');
    }

    
    public function uploadProfileImage(
        UploadedFile $file,
        string $tableName,
        string $columnName,
        string $userId,
        string $role
    ): string {
        
        $this->validateImageFile($file);

        
        $this->validateRole($role);

        
        $this->deleteOldProfileImage($tableName, $columnName, $userId, $role);

        
        $path = $this->generateProfileImagePath($role, $userId, $file);

        
        $storedPath = $this->storeFile($file, $path);

        
        $url = $this->getFileUrl($storedPath);

        
        $this->updateDatabase($tableName, $columnName, $userId, $url);

        return $url;
    }

    
    private function validateImageFile(UploadedFile $file): void
    {
        $validator = validator(
            ['file' => $file],
            ['file' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120']]
        );

        if ($validator->fails()) {
            throw new \InvalidArgumentException('Image invalide: ' . $validator->errors()->first());
        }
    }

    
    private function validateRole(string $role): void
    {
        if (!isset(self::ROLE_PREFIXES[$role])) {
            throw new \InvalidArgumentException("Rôle non supporté: $role. Les rôles valides sont: " . implode(', ', array_keys(self::ROLE_PREFIXES)));
        }
    }

    
    private function deleteOldProfileImage(string $tableName, string $columnName, string $userId, string $role): void
    {
        
        $oldUrl = DB::table($tableName)
            ->where('id', $userId)
            ->value($columnName);

        if ($oldUrl) {
            
            $oldPath = $this->getPathFromUrl($oldUrl);

            
            $userFolder = $role . '/' . $userId;
            $files = Storage::disk($this->disk)->files($userFolder);

            foreach ($files as $file) {
                Storage::disk($this->disk)->delete($file);
            }
        }
    }

    
    private function generateProfileImagePath(string $role, string $userId, UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        
        
        
        return $role . '/' . $userId . '.' . $extension;
    }

    
    private function storeFile(UploadedFile $file, string $path): string
    {
        
        $directory = dirname($path);
        $filename = pathinfo($path, PATHINFO_FILENAME);
        
        
        $existingFiles = Storage::disk($this->disk)->files($directory);
        foreach ($existingFiles as $existingFile) {
            $existingFilename = pathinfo($existingFile, PATHINFO_FILENAME);
            if ($existingFilename === $filename) {
                Storage::disk($this->disk)->delete($existingFile);
            }
        }

        
        return Storage::disk($this->disk)->putFileAs(
            dirname($path),
            $file,
            basename($path)
        );
    }

    
    private function getFileUrl(string $path): string
    {
        return Storage::disk($this->disk)->url($path);
    }

    
    private function getPathFromUrl(string $url): ?string
    {
        
        $parsed = parse_url($url);
        if (isset($parsed['path'])) {
            
            return ltrim(str_replace('/storage/', '', $parsed['path']), '/');
        }
        return null;
    }

    
    private function updateDatabase(string $tableName, string $columnName, string $userId, string $url): void
    {
        $updated = DB::table($tableName)
            ->where('id', $userId)
            ->update([
                $columnName => $url,
                'updated_at' => now()
            ]);

        if (!$updated) {
            throw new \RuntimeException("Impossible de mettre à jour l'enregistrement pour l'ID: $userId dans la table: $tableName");
        }
    }

    
    public function getProfileImageUrl(string $tableName, string $columnName, string $userId): ?string
    {
        return DB::table($tableName)
            ->where('id', $userId)
            ->value($columnName);
    }

    
    public function deleteProfileImage(string $tableName, string $columnName, string $userId, string $role): bool
    {
        
        $url = $this->getProfileImageUrl($tableName, $columnName, $userId);

        if ($url) {
            
            $userFolder = $role . '/' . $userId;
            $files = Storage::disk($this->disk)->files($userFolder);

            foreach ($files as $file) {
                Storage::disk($this->disk)->delete($file);
            }

            
            DB::table($tableName)
                ->where('id', $userId)
                ->update([
                    $columnName => null,
                    'updated_at' => now()
                ]);

            return true;
        }

        return false;
    }
}