package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.ExecutionResult;
import Nadmapa.BytePit.service.CodeExecutionService;
import org.springframework.stereotype.Service;

import java.io.*;

@Service
public class CodeExecutionServiceJpa implements CodeExecutionService {

    @Override
    public ExecutionResult execute(Long id, String code, String userInput) {
        System.out.println("Executing code for taskId: " + id + " with code: " + code);

        try {
            // Write the code to a temporary .java file
            String className = "TempClass" + id; // Make sure the class name is unique
            File sourceFile = new File(className + ".java");
            java.nio.file.Files.write(sourceFile.toPath(), code.getBytes());

            // Compile the source file
            ProcessBuilder compileProcessBuilder = new ProcessBuilder("javac", sourceFile.getName());
            Process compileProcess = compileProcessBuilder.start();
            compileProcess.waitFor();

            // Run the compiled class
            ProcessBuilder runProcessBuilder = new ProcessBuilder("java", className);
            Process runProcess = runProcessBuilder.start();

            // Write the user input to the process's standard input
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
                // Return error output if the process did not complete successfully
                return new ExecutionResult(null, errorOutput.toString());
            }

            // Clean up
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
}
