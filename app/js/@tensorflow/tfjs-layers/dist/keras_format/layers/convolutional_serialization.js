/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
// We can't easily extract a string[] from the string union type, but we can
// recapitulate the list, enforcing at compile time that the values are valid.
/**
 * A string array of valid ConvolutionalLayer class names.
 *
 * This is guaranteed to match the `ConvolutionalLayerClassName` union type.
 */
export const convolutionalLayerClassNames = [
    'Conv1D',
    'Conv2D',
    'Conv2DTranspose',
    'Cropping2D',
    'SeparableConv2D',
    'UpSampling2D',
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udm9sdXRpb25hbF9zZXJpYWxpemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1sYXllcnMvc3JjL2tlcmFzX2Zvcm1hdC9sYXllcnMvY29udm9sdXRpb25hbF9zZXJpYWxpemF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBNEVILDRFQUE0RTtBQUM1RSw4RUFBOEU7QUFFOUU7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFrQztJQUN6RSxRQUFRO0lBQ1IsUUFBUTtJQUNSLGlCQUFpQjtJQUNqQixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLGNBQWM7Q0FDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtEYXRhRm9ybWF0U2VyaWFsaXphdGlvbiwgUGFkZGluZ01vZGV9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge0NvbnN0cmFpbnRTZXJpYWxpemF0aW9ufSBmcm9tICcuLi9jb25zdHJhaW50X2NvbmZpZyc7XG5pbXBvcnQge0luaXRpYWxpemVyU2VyaWFsaXphdGlvbn0gZnJvbSAnLi4vaW5pdGlhbGl6ZXJfY29uZmlnJztcbmltcG9ydCB7UmVndWxhcml6ZXJTZXJpYWxpemF0aW9ufSBmcm9tICcuLi9yZWd1bGFyaXplcl9jb25maWcnO1xuaW1wb3J0IHtCYXNlTGF5ZXJTZXJpYWxpemF0aW9uLCBMYXllckNvbmZpZ30gZnJvbSAnLi4vdG9wb2xvZ3lfY29uZmlnJztcblxuZXhwb3J0IGludGVyZmFjZSBCYXNlQ29udkxheWVyQ29uZmlnIGV4dGVuZHMgTGF5ZXJDb25maWcge1xuICBrZXJuZWxfc2l6ZTogbnVtYmVyfG51bWJlcltdO1xuICBzdHJpZGVzPzogbnVtYmVyfG51bWJlcltdO1xuICBwYWRkaW5nPzogUGFkZGluZ01vZGU7XG4gIGRhdGFfZm9ybWF0PzogRGF0YUZvcm1hdFNlcmlhbGl6YXRpb247XG4gIGRpbGF0aW9uX3JhdGU/OiBudW1iZXJ8W251bWJlcl18W251bWJlciwgbnVtYmVyXTtcbiAgYWN0aXZhdGlvbj86IHN0cmluZztcbiAgdXNlX2JpYXM/OiBib29sZWFuO1xuICBrZXJuZWxfaW5pdGlhbGl6ZXI/OiBJbml0aWFsaXplclNlcmlhbGl6YXRpb247XG4gIGJpYXNfaW5pdGlhbGl6ZXI/OiBJbml0aWFsaXplclNlcmlhbGl6YXRpb247XG4gIGtlcm5lbF9jb25zdHJhaW50PzogQ29uc3RyYWludFNlcmlhbGl6YXRpb247XG4gIGJpYXNfY29uc3RyYWludD86IENvbnN0cmFpbnRTZXJpYWxpemF0aW9uO1xuICBrZXJuZWxfcmVndWxhcml6ZXI/OiBSZWd1bGFyaXplclNlcmlhbGl6YXRpb247XG4gIGJpYXNfcmVndWxhcml6ZXI/OiBSZWd1bGFyaXplclNlcmlhbGl6YXRpb247XG4gIGFjdGl2aXR5X3JlZ3VsYXJpemVyPzogUmVndWxhcml6ZXJTZXJpYWxpemF0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbnZMYXllckNvbmZpZyBleHRlbmRzIEJhc2VDb252TGF5ZXJDb25maWcge1xuICBmaWx0ZXJzOiBudW1iZXI7XG59XG5cbmV4cG9ydCB0eXBlIENvbnYxRExheWVyU2VyaWFsaXphdGlvbiA9XG4gICAgQmFzZUxheWVyU2VyaWFsaXphdGlvbjwnQ29udjFEJywgQ29udkxheWVyQ29uZmlnPjtcblxuZXhwb3J0IHR5cGUgQ29udjJETGF5ZXJTZXJpYWxpemF0aW9uID1cbiAgICBCYXNlTGF5ZXJTZXJpYWxpemF0aW9uPCdDb252MkQnLCBDb252TGF5ZXJDb25maWc+O1xuXG5leHBvcnQgdHlwZSBDb252MkRUcmFuc3Bvc2VMYXllclNlcmlhbGl6YXRpb24gPVxuICAgIEJhc2VMYXllclNlcmlhbGl6YXRpb248J0NvbnYyRFRyYW5zcG9zZScsIENvbnZMYXllckNvbmZpZz47XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VwYXJhYmxlQ29udkxheWVyQ29uZmlnIGV4dGVuZHMgQ29udkxheWVyQ29uZmlnIHtcbiAgZGVwdGhfbXVsdGlwbGllcj86IG51bWJlcjtcbiAgZGVwdGh3aXNlX2luaXRpYWxpemVyPzogSW5pdGlhbGl6ZXJTZXJpYWxpemF0aW9uO1xuICBwb2ludHdpc2VfaW5pdGlhbGl6ZXI/OiBJbml0aWFsaXplclNlcmlhbGl6YXRpb247XG4gIGRlcHRod2lzZV9yZWd1bGFyaXplcj86IFJlZ3VsYXJpemVyU2VyaWFsaXphdGlvbjtcbiAgcG9pbnR3aXNlX3JlZ3VsYXJpemVyPzogUmVndWxhcml6ZXJTZXJpYWxpemF0aW9uO1xuICBkZXB0aHdpc2VfY29uc3RyYWludD86IENvbnN0cmFpbnRTZXJpYWxpemF0aW9uO1xuICBwb2ludHdpc2VfY29uc3RyYWludD86IENvbnN0cmFpbnRTZXJpYWxpemF0aW9uO1xufVxuXG5leHBvcnQgdHlwZSBTZXBhcmFibGVDb252MkRMYXllclNlcmlhbGl6YXRpb24gPVxuICAgIEJhc2VMYXllclNlcmlhbGl6YXRpb248J1NlcGFyYWJsZUNvbnYyRCcsIENvbnZMYXllckNvbmZpZz47XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ3JvcHBpbmcyRExheWVyQ29uZmlnIGV4dGVuZHMgTGF5ZXJDb25maWcge1xuICBjcm9wcGluZzogbnVtYmVyfFtudW1iZXIsIG51bWJlcl18W1tudW1iZXIsIG51bWJlcl0sIFtudW1iZXIsIG51bWJlcl1dO1xuICBkYXRhX2Zvcm1hdD86IERhdGFGb3JtYXRTZXJpYWxpemF0aW9uO1xufVxuXG5leHBvcnQgdHlwZSBDcm9wcGluZzJETGF5ZXJTZXJpYWxpemF0aW9uID1cbiAgICBCYXNlTGF5ZXJTZXJpYWxpemF0aW9uPCdDcm9wcGluZzJEJywgQ3JvcHBpbmcyRExheWVyQ29uZmlnPjtcblxuZXhwb3J0IGludGVyZmFjZSBVcFNhbXBsaW5nMkRMYXllckNvbmZpZyBleHRlbmRzIExheWVyQ29uZmlnIHtcbiAgc2l6ZT86IG51bWJlcltdO1xuICBkYXRhX2Zvcm1hdD86IERhdGFGb3JtYXRTZXJpYWxpemF0aW9uO1xufVxuXG5leHBvcnQgdHlwZSBVcFNhbXBsaW5nMkRMYXllclNlcmlhbGl6YXRpb24gPVxuICAgIEJhc2VMYXllclNlcmlhbGl6YXRpb248J1VwU2FtcGxpbmcyRCcsIFVwU2FtcGxpbmcyRExheWVyQ29uZmlnPjtcblxuLy8gVXBkYXRlIGNvbnZvbHV0aW9uYWxMYXllckNsYXNzTmFtZXMgYmVsb3cgaW4gY29uY2VydCB3aXRoIHRoaXMuXG5leHBvcnQgdHlwZSBDb252b2x1dGlvbmFsTGF5ZXJTZXJpYWxpemF0aW9uID1cbiAgICBDb252MURMYXllclNlcmlhbGl6YXRpb258Q29udjJETGF5ZXJTZXJpYWxpemF0aW9ufFxuICAgIENvbnYyRFRyYW5zcG9zZUxheWVyU2VyaWFsaXphdGlvbnxTZXBhcmFibGVDb252MkRMYXllclNlcmlhbGl6YXRpb258XG4gICAgQ3JvcHBpbmcyRExheWVyU2VyaWFsaXphdGlvbnxVcFNhbXBsaW5nMkRMYXllclNlcmlhbGl6YXRpb247XG5cbmV4cG9ydCB0eXBlIENvbnZvbHV0aW9uYWxMYXllckNsYXNzTmFtZSA9XG4gICAgQ29udm9sdXRpb25hbExheWVyU2VyaWFsaXphdGlvblsnY2xhc3NfbmFtZSddO1xuXG4vLyBXZSBjYW4ndCBlYXNpbHkgZXh0cmFjdCBhIHN0cmluZ1tdIGZyb20gdGhlIHN0cmluZyB1bmlvbiB0eXBlLCBidXQgd2UgY2FuXG4vLyByZWNhcGl0dWxhdGUgdGhlIGxpc3QsIGVuZm9yY2luZyBhdCBjb21waWxlIHRpbWUgdGhhdCB0aGUgdmFsdWVzIGFyZSB2YWxpZC5cblxuLyoqXG4gKiBBIHN0cmluZyBhcnJheSBvZiB2YWxpZCBDb252b2x1dGlvbmFsTGF5ZXIgY2xhc3MgbmFtZXMuXG4gKlxuICogVGhpcyBpcyBndWFyYW50ZWVkIHRvIG1hdGNoIHRoZSBgQ29udm9sdXRpb25hbExheWVyQ2xhc3NOYW1lYCB1bmlvbiB0eXBlLlxuICovXG5leHBvcnQgY29uc3QgY29udm9sdXRpb25hbExheWVyQ2xhc3NOYW1lczogQ29udm9sdXRpb25hbExheWVyQ2xhc3NOYW1lW10gPSBbXG4gICdDb252MUQnLFxuICAnQ29udjJEJyxcbiAgJ0NvbnYyRFRyYW5zcG9zZScsXG4gICdDcm9wcGluZzJEJyxcbiAgJ1NlcGFyYWJsZUNvbnYyRCcsXG4gICdVcFNhbXBsaW5nMkQnLFxuXTtcbiJdfQ==