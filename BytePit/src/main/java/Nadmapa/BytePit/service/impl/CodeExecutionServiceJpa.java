package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.ExecutionResult;
import Nadmapa.BytePit.service.CodeExecutionService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class CodeExecutionServiceJpa implements CodeExecutionService {

    @Override
    public ExecutionResult execute(Long id, String code, String userInput) {
        System.out.println("Executing code for taskId: " + id + " with code: " + code);

        try {
            String className = "TempClass" + id;
            File sourceFile = new File(className + ".java");
            java.nio.file.Files.write(sourceFile.toPath(), code.getBytes());

            ProcessBuilder compileProcessBuilder = new ProcessBuilder("javac", sourceFile.getName());
            Process compileProcess = compileProcessBuilder.start();
            compileProcess.waitFor();

            ProcessBuilder runProcessBuilder = new ProcessBuilder("java", className);
            Process runProcess = runProcessBuilder.start();

            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(runProcess.getOutputStream()));
            writer.write(userInput);
            writer.newLine();
            writer.flush();
            writer.close();

            BufferedReader inputReader = new BufferedReader(new InputStreamReader(runProcess.getInputStream()));
            BufferedReader errorReader = new BufferedReader(new InputStreamReader(runProcess.getErrorStream()));

            String line;
            StringBuilder output = new StringBuilder();
            while ((line = inputReader.readLine()) != null) {
                output.append(line).append("\n");
            }

            StringBuilder errorOutput = new StringBuilder();
            while ((line = errorReader.readLine()) != null) {
                errorOutput.append(line).append("\n");
            }

            int exitCode = runProcess.waitFor();
            if (exitCode != 0) {
                return new ExecutionResult(null, errorOutput.toString());
            }

            boolean sourceFileDeleted = sourceFile.delete();
            boolean classFileDeleted = new File(className + ".class").delete();

            if (!sourceFileDeleted || !classFileDeleted) {
                System.err.println("Warning: Unable to delete one or more temporary files.");
            }

            return new ExecutionResult(output.toString(), null);
        } catch (Exception e) {
            e.printStackTrace();
            return new ExecutionResult(null, e.getMessage());
        }
    }

    @Override
    public String submit(MultipartFile file) {
        File tempFile = null;
        Path tempDir = null;

        try {
            String code = new String(file.getBytes());
            String className = extractClassName(code);

            if (className == null) {
                return "Error: No valid class found in the submitted code.";
            }

            tempDir = Files.createTempDirectory("tempCodeDir");
            tempFile = new File(tempDir.toFile(), className + ".java");
            Files.write(tempFile.toPath(), code.getBytes());

            String compilationResult = compileJavaFile(tempFile);
            if (compilationResult != null) {
                return compilationResult;
            }

            String executionResult = runJavaClass(tempDir.toString(), className);
            if (executionResult != null) {
                System.out.println("Output: " + executionResult);
                return executionResult;
            }

            return "Execution completed without output.";

        } catch (Exception e) {
            return "Error executing code: " + e.getMessage();
        } finally {
            cleanupFiles(tempFile, tempDir);
        }
    }


    private String compileJavaFile(File javaFile) throws IOException, InterruptedException {
        ProcessBuilder compileProcessBuilder = new ProcessBuilder("javac", javaFile.getAbsolutePath());
        Process compileProcess = compileProcessBuilder.start();
        compileProcess.waitFor();

        if (compileProcess.exitValue() != 0) {
            return readProcessOutput(compileProcess.getErrorStream());
        }

        return null;
    }

    private String runJavaClass(String classPath, String className) throws IOException, InterruptedException {
        ProcessBuilder runProcessBuilder = new ProcessBuilder("java", "-cp", classPath, className);
        Process runProcess = runProcessBuilder.start();
        runProcess.waitFor();

        if (runProcess.exitValue() != 0) {
            return readProcessOutput(runProcess.getErrorStream());
        }

        return readProcessOutput(runProcess.getInputStream());
    }

    private String extractClassName(String code) {
        Pattern pattern = Pattern.compile("public\\s+class\\s+([\\w_]+)");
        Matcher matcher = pattern.matcher(code);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    private String readProcessOutput(InputStream inputStream) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            return reader.lines().collect(Collectors.joining("\n"));
        }
    }

    private void cleanupFiles(File tempFile, Path tempDir) {
        deleteFile(tempFile);

        if (tempDir != null) {
            deleteDirectoryRecursively(tempDir.toFile());
        }
    }

    private void deleteFile(File file) {
        if (file != null && file.exists()) {
            boolean isDeleted = file.delete();
            if (isDeleted) {
                System.out.println("Successfully deleted file: " + file.getAbsolutePath());
            } else {
                System.err.println("Failed to delete file: " + file.getAbsolutePath());
            }
        }
    }

    private void deleteDirectoryRecursively(File dir) {
        if (dir != null && dir.exists()) {
            File[] files = dir.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        deleteDirectoryRecursively(file);
                    } else {
                        deleteFile(file);
                    }
                }
            }

            boolean isDeleted = dir.delete();
            if (isDeleted) {
                System.out.println("Successfully deleted directory: " + dir.getAbsolutePath());
            } else {
                System.err.println("Failed to delete directory: " + dir.getAbsolutePath());
            }
        }
    }
}
