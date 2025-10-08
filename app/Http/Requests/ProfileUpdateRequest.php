<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'nim_nip' => ['nullable', 'string', 'max:255'],
            'institution' => ['nullable', 'string', 'max:255'],
            'age' => ['nullable', 'integer', 'min:1'],
            'address' => ['nullable', 'string'],
            'internship_duration' => ['nullable', 'string', 'max:255'],
            'internship_field' => ['nullable', 'string', 'max:255'],
            'cv' => ['nullable', 'file', 'mimes:pdf', 'max:2048'], // Max 2MB
            'transcript' => ['nullable', 'file', 'mimes:pdf', 'max:2048'],
            'cover_letter' => ['nullable', 'file', 'mimes:pdf', 'max:2048'],
        ];
    }
}