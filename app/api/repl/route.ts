import { exec } from "child_process"

export async function POST(request: Request) {
  const json = await request.json()
  const jsonData = JSON.parse(json.code)
  console.log(jsonData.code)

  const { code } = json as {
    code: string
  }

  try {
    const result = await new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
        exec(`python -c "${jsonData.code}"`, (error, stdout, stderr) => {
          if (error) {
            reject(error)
            return
          }

          resolve({ stdout, stderr })
        })
      }
    )

    return new Response(
      JSON.stringify({
        status: "Code exécuté",
        output: result.stdout,
        errors: result.stderr
      }),
      {
        status: 200
      }
    )
  } catch (error) {
    console.error("Erreur:", error)
    return new Response(
      JSON.stringify({ error: "Erreur lors de l'exécution du code" }),
      {
        status: 500
      }
    )
  }
}
